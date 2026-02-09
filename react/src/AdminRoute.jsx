import { Navigate } from "react-router-dom";
import { useStateContext } from "./contexts/ContextProvider.jsx";

export default function AdminRoute({ children }) {
  const { user } = useStateContext();

  
  if (!user || !user.id) {
    return <Navigate to="/login" replace />;
  }

  
  if (user?.uloga_id !== 2) {
    return <Navigate to="/dashboard" replace />;
  }

  
  return children;
}