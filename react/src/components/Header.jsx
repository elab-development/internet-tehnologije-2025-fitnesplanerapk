import React, { useState } from 'react';
import { useStateContext } from '../contexts/ContextProvider.jsx';
import { useNavigate } from 'react-router-dom';
import Button from './Button.jsx';
import MenuIcon from './MenuIcon.jsx';
import Menu from './Menu.jsx';

export default function Header() {
  const { user, setUser, setToken } = useStateContext();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = user?.uloga_id === 2;
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  const handleMenuClick = () => {
    setMenuOpen(prev => !prev);
  };

  return (
   <header className="app-header flex justify-between items-center p-4 text-white">

      <div className="flex items-center relative">
        {!isAdmin && (
          <>
            <MenuIcon
              onClick={handleMenuClick}
              className="cursor-pointer hover:text-yellow-300 transition-colors"
            />

            {menuOpen && (
              <div className="absolute top-12 left-0 bg-white text-gray-800 p-3 rounded-lg shadow-lg z-50 w-48">
                <Menu />
              </div>
            )}
          </>
        )}
        <h1 className="ml-3 text-lg font-semibold select-none">Fitness Aplikacija</h1>

        {menuOpen && (
          <div className="absolute top-12 left-0 bg-white text-gray-800 p-3 rounded-lg shadow-lg z-50 w-48">
            <Menu />
          </div>
        )}
      </div>

      {user && (
        <div className="flex items-center gap-3">
          <span className="font-medium">Zdravo, {user.ime}</span>
          <Button
            onClick={handleLogout}
            
          >
            Logout
          </Button>
        </div>
      )}
    </header>
  );
}
