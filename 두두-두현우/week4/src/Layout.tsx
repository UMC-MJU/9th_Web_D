import type { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
  username: string;
  isLoggedIn: boolean;
  onLogin: (email: string, password: string) => void;
  onLogout: () => void;
}

export default function Layout({
  children,
  username,
  isLoggedIn,
  onLogin,
  onLogout,
}: LayoutProps) {
  return (
    <div className="min-h-screen">
      <Navbar
        username={username}
        isLoggedIn={isLoggedIn}
        onLogin={onLogin}
        onLogout={onLogout}
      />
      <main>{children}</main>
    </div>
  );
}
