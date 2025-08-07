// packages/atropos-desktop/src/renderer/src/components/ProtectedRoute.tsx
import { useAuthStore } from '../store/authStore';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

