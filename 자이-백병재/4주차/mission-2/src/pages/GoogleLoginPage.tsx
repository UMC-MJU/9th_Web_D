import { useEffect } from "react";
import { Local_STORAGE_KEYS } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";

const GoogleLoginPage = () => {
  const { setItem: setAccessToken } = useLocalStorage(
    Local_STORAGE_KEYS.accessToken,
  );

  const { setItem: setRefreshToken } = useLocalStorage(
    Local_STORAGE_KEYS.refreshToken,
  );

  useEffect(() => {
    const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
    const accessToken: string | null = urlParams.get(Local_STORAGE_KEYS.accessToken);
    const refreshToken: string | null = urlParams.get(Local_STORAGE_KEYS.refreshToken);

    if (accessToken && refreshToken) {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
    }

    window.location.replace("/");
  }, [setAccessToken, setRefreshToken]);

  return <div>Loading...</div>;
};

export default GoogleLoginPage;