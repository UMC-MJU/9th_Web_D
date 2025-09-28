/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // 클래스 기반 다크모드 활성화
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    // 다크모드 클래스들을 명시적으로 포함
    "dark:bg-gray-800",
    "dark:bg-gray-700",
    "dark:bg-gray-600",
    "dark:bg-gray-900",
    "dark:text-white",
    "dark:text-gray-300",
    "dark:text-gray-200",
    "dark:border-gray-600",
    "dark:border-gray-700",
  ],
};
