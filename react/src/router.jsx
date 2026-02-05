
import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./views/Login.jsx";
import Register from "./views/Register.jsx";
import Users from "./views/Users.jsx";
import NotFound from "./views/NotFound.jsx";
import DefaultLayout from "./components/DefaultLayout.jsx";
import GuestLayout from "./components/GuestLayout.jsx";
import Dashboard from "./views/Dashboard.jsx";
import AdminDashboard from "./views/AdminDashboard.jsx";
import AdminRoute from "./AdminRoute.jsx";
import UserSetupPage from "./views/UserSetupPage.jsx";
import DodajObrok from "./views/Ishrana.jsx";
import ObrociPregled from "./views/ObrociPregled.jsx";


const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '/users',
        element: <Users />
      },
      
      {
        path: '/dashboard',
        element: <Dashboard />
      },

      {
        path: '/admin_dashboard',
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        )
      },

      {
        path: '/userSetup',
        element: <UserSetupPage />
      },

      {
          path: '/dodajObrok',
          element: <DodajObrok />
      },

      {
          path: '/obrociPregled',
          element: <ObrociPregled />
      }

    ]
  },

  {
    path: '/',
    element: <GuestLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />
      },

      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      }
    ]
  },

  {
    path: '*',
    element: <NotFound />
  }
]);

export default router;
