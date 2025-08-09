// packages/atropos-desktop/src/renderer/src/components/Header.tsx
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuthStore } from '../store/authStore';
import { useLayoutStore } from '../store/layoutStore';

export const Header = () => {
  const logout = useAuthStore((state) => state.logout);
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleSidebar}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
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

