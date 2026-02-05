// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import { RouterProvider } from 'react-router-dom';
// import router from "./router.jsx";
// import { ContextProvider } from './contexts/ContextProvider.jsx';

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <ContextProvider>
//         <RouterProvider router={router} />
//     </ContextProvider>
    
//   </StrictMode>,
// )
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from "./router.jsx";
import { ContextProvider } from './contexts/ContextProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextProvider>
     
      <div className="relative min-h-screen bg-background">

      
        <img
          src="/zenaNova-removebg-preview.png"
          alt="Leva osoba"
          
           className="fixed left-[-20px] top-[55%] transform -translate-y-1/2 h-4/6 object-contain z-0"
            
        />
        <img
          src="/musko-removebg-preview.png"
          alt="Desna osoba"
          className="fixed right-0 top-[55%] transform -translate-y-1/2 h-4/5 object-contain z-0"
        />

 
        <div className="relative z-10">
          <RouterProvider router={router} />
        </div>
      </div>
    </ContextProvider>
  </StrictMode>
);



