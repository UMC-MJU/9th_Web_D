export type themeType = '🌙' | '☁️' | '☀️';     // 테마 타입 지정

export interface themeContextType {                    // context의 인터페이스 지정
  theme: themeType;
  themeChange: (nowTheme: themeType) => void;   // 타입을 변환할 함수
}