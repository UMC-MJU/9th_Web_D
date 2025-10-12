import type { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
  username: string;
}

export default function Layout({ children, username }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <Navbar username={username} />
      <main>{children}</main>
    </div>
  );
}
