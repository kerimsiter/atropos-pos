// packages/atropos-desktop/src/renderer/src/App.tsx
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';

function App(): JSX.Element {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
              <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />}
          />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
    </Router>
  );
}

export default App;
