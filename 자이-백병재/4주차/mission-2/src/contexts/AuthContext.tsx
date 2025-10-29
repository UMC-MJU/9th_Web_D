import { createContext, useState, type PropsWithChildren } from "react";
import type { RequestSigninDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Local_STORAGE_KEYS } from "../constants/key";
import { postSignin } from "../apis/auth";

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    login: (siginInData: RequestSigninDto) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    login: async () => {},
    logout: async () => {}
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const{ setItem:setStorageAccessToken, getItem:getStorageAccessToken, removeItem:removeStorageAccessToken } =
        useLocalStorage(Local_STORAGE_KEYS.accessToken);
    const{ setItem:setStorageRefreshToken, getItem:getStorageRefreshToken, removeItem:removeStorageRefreshToken } = 
        useLocalStorage(Local_STORAGE_KEYS.refreshToken);

    const [accessToken, setAccessToken] = useState<string | null>(
        () => getStorageAccessToken(),
    );
    const [refreshToken, setRefreshToken] = useState<string | null>(
        () => getStorageRefreshToken(),
    );

    const login = async (siginInData: RequestSigninDto) => {
        const {data} = await postSignin(siginInData);
        if(data) {
            setStorageAccessToken(data.accessToken);
            setStorageRefreshToken(data.refreshToken);
            setAccessToken(data.accessToken);
            setRefreshToken(data.refreshToken);
        }
    };
    
    const logout = async () => {
        try {
            
        } catch (error) {
            console.error("Server logout failed:", error);
        } finally {
            removeStorageAccessToken();
            removeStorageRefreshToken();
            setAccessToken(null);
            setRefreshToken(null);
        }
    };

    return (<AuthContext.Provider value={{ accessToken, refreshToken, login, logout }}>
        {children}
    </AuthContext.Provider>
    );
}