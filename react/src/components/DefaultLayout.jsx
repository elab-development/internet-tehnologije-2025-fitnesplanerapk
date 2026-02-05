import React from 'react'
import { useState } from 'react';
import {Navigate, Outlet} from "react-router-dom";
import { useStateContext } from '../contexts/ContextProvider';
export default function DefaultLayout() {
    const{user, token}=useStateContext()
     if(!token){
         return <Navigate to="/login" />
     }
  return (
    <div id="defaultLayout">
        <Outlet />
    </div>
  )
}


// import { Navigate, Outlet } from "react-router-dom";
// import { useStateContext } from "../contexts/ContextProvider.jsx";
// import Header from "./Header.jsx";

// export default function DefaultLayout() {
//   const { token } = useStateContext();

//   if (!token) {
//     return <Navigate to="/login" />;
//   }

//   return (
//     <div className="relative min-h-screen overflow-hidden">

//       {/* POZADINA */}
//       <img
//         src="/zenaNova-removebg-preview.png"
//         className="fixed left-[-20px] top-1/2 -translate-y-1/2 h-4/6 z-0 pointer-events-none"
//       />

//       <img
//         src="/musko-removebg-preview.png"
//         className="fixed right-0 top-1/2 -translate-y-1/2 h-4/5 z-0 pointer-events-none"
//       />

//       {/* SADRŽAJ */}
//       <div className="relative z-10">
//         <Header />
//         <Outlet />
//       </div>

//     </div>
//   );
// }
