import { Loader2 } from 'lucide-react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { admin, checking } = useAuth();
  const location = useLocation();
  if (checking) {
    return <div className="grid min-h-screen place-items-center" role="status"><Loader2 className="animate-spin" aria-label="Checking session" /></div>;
  }
  if (!admin) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return children;
}
