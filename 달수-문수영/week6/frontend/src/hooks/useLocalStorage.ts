import { useState, useEffect } from 'react';

// 로컬 스토리지에서 값을 가져오는 함수
function getStorageValue<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
    return defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

// 로컬 스토리지에 값을 저장하는 함수
function setStorageValue<T>(key: string, value: T): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Same-tab listeners won't receive 'storage' events; emit a custom event.
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-changed'));
    }
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
}

// 로컬 스토리지에서 값을 삭제하는 함수
function removeStorageValue(key: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.removeItem(key);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-changed'));
    }
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
}

/**
 * 로컬 스토리지를 React state와 동기화하는 커스텀 훅
 * @param key - 로컬 스토리지 키
 * @param defaultValue - 기본값
 * @returns [storedValue, setValue, removeValue] - 저장된 값, 설정 함수, 삭제 함수
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // 초기값을 로컬 스토리지에서 가져오거나 기본값 사용
  const [storedValue, setStoredValue] = useState<T>(() =>
    getStorageValue(key, defaultValue)
  );

  // 값이 변경될 때마다 로컬 스토리지에 저장
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // 함수인 경우 현재 값에 적용
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // state 업데이트
      setStoredValue(valueToStore);
      
      // 로컬 스토리지에 저장
      setStorageValue(key, valueToStore);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // 로컬 스토리지에서 값 삭제
  const removeValue = () => {
    try {
      setStoredValue(defaultValue);
      removeStorageValue(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  // 다른 탭에서 로컬 스토리지가 변경되었을 때 동기화
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage value for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue, removeValue];
}

// 사용자 정보 관련 타입 정의
export interface UserInfo {
  id: string;
  email: string;
  nickname: string;
  token: string;
  loginTime: number;
}

// 토큰 관련 타입 정의
export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// 기본 사용자 정보
export const defaultUserInfo: UserInfo = {
  id: '',
  email: '',
  nickname: '',
  token: '',
  loginTime: 0,
};

// 기본 토큰 정보
export const defaultAuthToken: AuthToken = {
  accessToken: '',
  refreshToken: '',
  expiresAt: 0,
};
