// packages/atropos-desktop/src/renderer/src/layouts/MainLayout.tsx
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';

export const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* Bu, içeriğin Header'ın altına itilmesini sağlar */}
        <Outlet /> {/* Alt rotalar (Dashboard, Products vb.) burada render edilecek */}
      </Box>
    </Box>
  );
};

