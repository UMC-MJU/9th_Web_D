import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import type { AuthHandlers } from "./apis/auth";
import { useState } from "react";
import AddLpModal from "./components/AddLpModal";

export default function Layout(authHandlers: AuthHandlers) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  return (
    <div className="min-h-screen">
      <Navbar {...authHandlers} />
      <main>
        <Outlet />
      </main>
      <button
        type="button"
        onClick={() => setIsAddOpen(true)}
        aria-label="Add LP"
        className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-white text-black shadow-xl cursor-pointer hover:bg-white/90 transition flex items-center justify-center"
      >
        <span className="text-2xl leading-none">+</span>
      </button>
      <AddLpModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
}
