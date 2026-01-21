import { Navigate } from "react-router-dom";
import { useStateContext } from "./contexts/ContextProvider.jsx";

export default function AdminRoute({ children }) {
  const { user } = useStateContext();

  // Ako user nije ulogovan
  if (!user || !user.id) {
    return <Navigate to="/login" replace />;
  }

  // Ako nije admin (uloga_id !== 2)
  if (user?.uloga_id !== 2) {
    return <Navigate to="/dashboard" replace />;
  }

  // Ako je admin, renderuj decu
  return children;
}