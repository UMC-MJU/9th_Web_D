import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import type { AuthHandlers } from "./apis/auth";

export default function Layout(authHandlers: AuthHandlers) {
  return (
    <div className="min-h-screen">
      <Navbar {...authHandlers} />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
