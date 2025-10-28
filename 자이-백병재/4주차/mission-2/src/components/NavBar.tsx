import { NavLink } from 'react-router-dom';

const NavBar = () => {
  const shadowClass = "[text-shadow:0_1px_4px_rgb(0_0_0_/_0.9)]";

  const baseLinkClass = `
    px-3 py-2 rounded-md text-sm font-medium 
    transition-all duration-200 ease-in-out
    ${shadowClass}
  `;
  const activeLinkClass = "text-white font-semibold transform scale-120";
  const inactiveLinkClass = "text-white hover:scale-105 hover:opacity-80"; 

  return (
    <nav 
      className="fixed top-0 w-full z-50 py-4 bg-transparent">
      <div className="flex h-12 items-center justify-between px-8"> 
        <div className="flex items-center">
          <NavLink 
            to="/" 
            className={`
              text-white font-bold text-xl tracking-tight 
              transition-all duration-300 ease-in-out 
              ${shadowClass}
              hover:scale-105 hover:opacity-90
            `}
          >
            LPage
          </NavLink>
        </div>

        <div className="flex items-center space-x-6">
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
            }
          >
            Login
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;