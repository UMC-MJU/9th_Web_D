import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const NavBar = () => {
  const shadowClass = "[text-shadow:0_1px_4px_rgb(0_0_0_/_0.9)]";

  const baseLinkClass = `
    px-3 py-2 rounded-md text-sm font-medium 
    transition-all duration-200 ease-in-out
    ${shadowClass}
  `;
  const activeLinkClass = "text-white font-semibold transform scale-120";
  const inactiveLinkClass = "text-white hover:scale-105 hover:opacity-80"; 

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("accessToken");
  });
  
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem("userName");
  });

  useEffect(() => {
    const handleLogin = () => {
      setIsLoggedIn(!!localStorage.getItem("accessToken"));
      setUserName(localStorage.getItem("userName"));
    };

    window.addEventListener('login', handleLogin);

    return () => {
      window.removeEventListener('login', handleLogin);
    };
  }, []);

  const { logout } = useAuth();
  
  const handleLogout = async () => {
      await logout();
  }

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
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <span className={`text-white text-sm font-medium ${shadowClass}`}>
                {userName ? `${userName}님` : ''}
              </span>
              <button
                onClick={handleLogout}
                className={`${baseLinkClass} ${inactiveLinkClass} cursor-pointer`}
                type="button" 
              >
                Logout
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
              }
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;