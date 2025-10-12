import { UserInfo, AuthToken, defaultUserInfo, defaultAuthToken } from '../hooks/useLocalStorage';

/**
 * 로컬 스토리지에서 사용자 정보를 가져옵니다
 */
export const getUserInfo = (): UserInfo => {
  try {
    const stored = localStorage.getItem('userInfo');
    return stored ? JSON.parse(stored) : defaultUserInfo;
  } catch (error) {
    console.error('Error getting user info:', error);
    return defaultUserInfo;
  }
};

/**
 * 로컬 스토리지에서 인증 토큰을 가져옵니다
 */
export const getAuthToken = (): AuthToken => {
  try {
    const stored = localStorage.getItem('authToken');
    return stored ? JSON.parse(stored) : defaultAuthToken;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return defaultAuthToken;
  }
};

/**
 * 사용자가 로그인되어 있는지 확인합니다
 */
export const isLoggedIn = (): boolean => {
  const userInfo = getUserInfo();
  const authToken = getAuthToken();
  
  return !!(userInfo.token && authToken.accessToken && authToken.expiresAt > Date.now());
};

/**
 * 토큰이 만료되었는지 확인합니다
 */
export const isTokenExpired = (): boolean => {
  const authToken = getAuthToken();
  return authToken.expiresAt <= Date.now();
};

/**
 * 로그아웃 처리 (로컬 스토리지에서 사용자 정보와 토큰 제거)
 */
export const logout = (): void => {
  try {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('authToken');
    console.log('로그아웃 완료');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

/**
 * 현재 로그인된 사용자의 닉네임을 가져옵니다
 */
export const getCurrentUserNickname = (): string => {
  const userInfo = getUserInfo();
  return userInfo.nickname || '';
};

/**
 * 현재 로그인된 사용자의 이메일을 가져옵니다
 */
export const getCurrentUserEmail = (): string => {
  const userInfo = getUserInfo();
  return userInfo.email || '';
};
