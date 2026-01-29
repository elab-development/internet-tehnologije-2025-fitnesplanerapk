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

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  const handleMenuClick = () => {
    setMenuOpen(prev => !prev);
  };

  return (
    <header className="app-header flex justify-between items-center p-4 bg-blue-600 text-white shadow-md sticky top-0 z-50">
      <div className="flex items-center relative">
        <MenuIcon onClick={handleMenuClick} className="cursor-pointer hover:text-yellow-300 transition-colors"/>
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
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
          >
            Logout
          </Button>
        </div>
      )}
    </header>
  );
}
