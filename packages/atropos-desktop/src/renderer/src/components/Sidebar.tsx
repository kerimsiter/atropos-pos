// packages/atropos-desktop/src/renderer/src/components/Sidebar.tsx
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import PercentIcon from '@mui/icons-material/Percent';

const drawerWidth = 240;

export const Sidebar = () => {
  const navigate = useNavigate();
  const menuItems = [
    { text: 'Ana Panel', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Ürünler', icon: <InventoryIcon />, path: '/products' },
    { text: 'Kategoriler', icon: <CategoryIcon />, path: '/categories' },
    { text: 'Vergiler', icon: <PercentIcon />, path: '/taxes' }, // Bu satırı ekle
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

