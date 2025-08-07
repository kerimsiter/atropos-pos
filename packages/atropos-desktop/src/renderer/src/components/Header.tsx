// packages/atropos-desktop/src/renderer/src/components/Header.tsx
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useAuthStore } from '../store/authStore';

export const Header = () => {
  const logout = useAuthStore((state) => state.logout);

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Atropos POS
        </Typography>
        <Button color="inherit" onClick={logout}>
          Çıkış Yap
        </Button>
      </Toolbar>
    </AppBar>
  );
};

