import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Redirect to login if not authenticated
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="mm-loading-screen"><div className="mm-spinner"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Redirect to admin dashboard if not admin
export function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="mm-loading-screen"><div className="mm-spinner"></div></div>;
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;
  return children;
}

// Redirect to home if already logged in
export function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="mm-loading-screen"><div className="mm-spinner"></div></div>;
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/home'} replace />;
  return children;
}
