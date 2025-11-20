import { useEffect } from "react";

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

export const Sidebar = ({ isOpen, toggle }: SidebarProps) => {
  
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggle();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [toggle]);

  return (
    <>
    {/* transition-opacity : 투명도 값이 변할때 애니메이션 */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={toggle}
      />

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold">메뉴</h2>
          <ul className="mt-4 space-y-2">
          </ul>
        </div>
      </aside>
    </>
  );
};