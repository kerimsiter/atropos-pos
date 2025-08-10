// packages/atropos-desktop/src/renderer/src/App.tsx
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import InventoryPage from './pages/InventoryPage';
import CategoriesPage from './pages/CategoriesPage';
import TaxesPage from './pages/TaxesPage';
import TableManagementPage from './pages/TableManagementPage'; // Ekle
import BranchesPage from './pages/BranchesPage';
import OrderPage from './pages/OrderPage';
import KitchenPage from './pages/KitchenPage';
import CustomersPage from './pages/CustomersPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import { MainLayout } from './layouts/MainLayout';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
        
        {/* Korumalı Rotalar Artık MainLayout'ı Kullanıyor */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/taxes" element={<TaxesPage />} />
            <Route path="/tables" element={<TableManagementPage />} /> {/* Bu satırı ekle */}
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/customers/:id" element={<CustomerDetailPage />} />
            <Route path="/branches" element={<BranchesPage />} />
            <Route path="/order/:tableId" element={<OrderPage />} />
            <Route path="/kitchen" element={<KitchenPage />} />
          </Route>
        </Route>

        {/* Varsayılan Yönlendirme */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
