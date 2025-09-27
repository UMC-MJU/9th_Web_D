// createContext를 한다.

import { createContext } from "react";
import type { themeContextType } from "../types/theme";

// Context 생성
export const ThemeContext = createContext<themeContextType | undefined>(undefined);