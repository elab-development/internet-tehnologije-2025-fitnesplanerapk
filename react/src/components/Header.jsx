// import React from 'react';
// import { useStateContext } from '../contexts/ContextProvider.jsx';
// import { useState } from "react";
// import Button from './Button.jsx';
// import { useNavigate } from 'react-router-dom';
// import MenuIcon from './MenuIcon.jsx';
// import Menu from './Menu.jsx';
// export default function Header() {
//   const { user, setUser, setToken } = useStateContext();
//   const navigate = useNavigate();
//   const [menuOpen, setMenuOpen] = useState(false);
//   const handleLogout = () => {
//     setToken(null); 
//     setUser(null); 
//     navigate("/login");
//   };

  
//   const handleMenuClick = () => {
//     console.log("Klik na meni");
//     setMenuOpen(prev => !prev);
//   };

//   return (
//     <header style={headerStyle}>
//       <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
//         <MenuIcon onClick={handleMenuClick} />
//         <h1 style={titleStyle}>Fitness Aplikacija</h1>

//         {menuOpen && (
//           <div style={menuWrapperStyle}>
//             <Menu />
//           </div>
//         )}
//       </div>

//       {user && (
//         <div style={userInfoStyle}>
//           <span style={{ marginRight: '10px' }}>
//             Zdravo, {user.ime}
//           </span>
//           <Button onClick={handleLogout}>Logout</Button>
//         </div>
//       )}
//     </header>
//   );
// }


// const headerStyle = {
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   padding: '10px 20px',
//   backgroundColor: '#2c3e50',
//   color: '#fff',
// };

// const titleStyle = {
//   margin: 0,
// };

// const userInfoStyle = {
//   display: 'flex',
//   alignItems: 'center',
// };
// const menuWrapperStyle = {
//   position: "absolute",
//   top: "50px",
//   left: "0",
//   backgroundColor: "#34495e",
//   padding: "10px 15px",
//   borderRadius: "6px",
//   boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
//   zIndex: 1000,
// };

import React from 'react';
import { useStateContext } from '../contexts/ContextProvider.jsx';
import { useState } from "react";
import Button from './Button.jsx';
import { useNavigate } from 'react-router-dom';
import "../index.css";
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
    <header className="app-header flex justify-between items-center p-4 text-white">

      
      <div className="flex items-center relative">
        <MenuIcon onClick={handleMenuClick} />
        <h1 className="ml-3 text-lg font-semibold">Fitness Aplikacija</h1>

        {menuOpen && (
          <div className="absolute top-12 left-0 bg-blue-700 p-3 rounded shadow-lg z-50">
            <Menu />
          </div>
        )}
      </div>

    
      {user && (
        <div className="flex items-center gap-3">
          <span>Zdravo, {user.ime}</span>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      )}
    </header>
  );
}
