import type { ReactNode } from "react";

// Link 컴포넌트의 props 타입
export interface LinkProps {
  to: string;
  children: ReactNode;
}

// Route 컴포넌트의 props 타입
export interface RouteProps {
  path: string;
  component: () => React.JSX.Element;
}

// Routes 컴포넌트의 props 타입
export interface RoutesProps {
  children: ReactNode;
}
