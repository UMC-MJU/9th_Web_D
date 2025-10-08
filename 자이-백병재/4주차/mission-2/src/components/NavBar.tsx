import { NavLink } from 'react-router-dom';

const NavBar = () => {
  const baseLinkClass = "px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const activeLinkClass = "bg-gray-900 text-white";
  const inactiveLinkClass = "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <nav 
      className="
        fixed top-0 w-full z-50 
        bg-gradient-to-b from-gray-800 from-[80%] to-transparent
      "
    >
      <div className="flex h-16 items-center justify-between px-8">
        <div className="flex items-center">
          <NavLink to="/" className="text-white font-bold text-lg">
            My App
          </NavLink>
        </div>
        <div className="flex items-center space-x-4">
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