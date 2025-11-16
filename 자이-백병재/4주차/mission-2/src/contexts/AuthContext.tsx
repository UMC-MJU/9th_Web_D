import { createContext, useContext, useState, type PropsWithChildren } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query"; 
import type { RequestSigninDto, ResponseMyInfoDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Local_STORAGE_KEYS, QUERY_KEY } from "../constants/key";
import { getMyInfo, postSignin, postSignout } from "../apis/auth";

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    login: (siginInData: RequestSigninDto) => Promise<void>;
    logout: () => Promise<void>;
    userData: ResponseMyInfoDto | null;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    login: async () => {},
    logout: async () => {},
    userData: null,
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

    const queryClient = useQueryClient();

    const { data: userData } = useQuery<ResponseMyInfoDto>({
      queryKey: [QUERY_KEY.myInfo],
      queryFn: getMyInfo,
      enabled: !!accessToken,
    });

    const login = async (siginInData: RequestSigninDto) => {
        const {data} = await postSignin(siginInData);
            if(data) {
                setStorageAccessToken(data.accessToken);
                setStorageRefreshToken(data.refreshToken);
                setAccessToken(data.accessToken)
                setRefreshToken(data.refreshToken);
                queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
            }
    };
    
    const logout = async () => {
        try {
            await postSignout();
        } catch (error) {
            console.error("Server logout failed:", error);
        } finally {
            removeStorageAccessToken();
            removeStorageRefreshToken();
            setAccessToken(null);
            setRefreshToken(null);
            queryClient.removeQueries({ queryKey: [QUERY_KEY.myInfo] });
        }
    };

    return (<AuthContext.Provider 
        value={{ accessToken, refreshToken, login, logout, userData: userData || null }}
    >
        {children}
    </AuthContext.Provider>
    );
}

export const useAuth = () => {
  const context = 	useContext(AuthContext);
  if (context === undefined) {
    alert("useAuth must be used within an AuthProvider");
  }
  return context;
};