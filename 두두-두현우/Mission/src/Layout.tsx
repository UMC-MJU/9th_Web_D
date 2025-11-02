import type { ReactNode } from "react";
import Navbar from "./Navbar";
import type { AuthHandlers } from "./apis/auth";

interface LayoutProps extends AuthHandlers {
  children: ReactNode;
}

export default function Layout({ children, ...authHandlers }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <Navbar {...authHandlers} />
      <main>{children}</main>
    </div>
  );
}
