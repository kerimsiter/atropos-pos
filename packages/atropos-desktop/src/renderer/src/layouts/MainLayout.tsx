// packages/atropos-desktop/src/renderer/src/layouts/MainLayout.tsx
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Toaster } from 'react-hot-toast';

export const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Toaster position="bottom-center" />
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          backgroundColor: (theme) => theme.palette.background.default,
          minHeight: '100vh',
          overflowX: 'hidden',
        }}
      >
        <Toolbar /> {/* Bu, içeriğin Header'ın altına itilmesini sağlar */}
        <Outlet /> {/* Alt rotalar (Dashboard, Products vb.) burada render edilecek */}
      </Box>
    </Box>
  );
};

