// packages/atropos-desktop/src/renderer/src/components/Sidebar.tsx
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import PercentIcon from '@mui/icons-material/Percent';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import StorefrontIcon from '@mui/icons-material/Storefront';
import KitchenIcon from '@mui/icons-material/Kitchen';

const drawerWidth = 240;

export const Sidebar = () => {
  const navigate = useNavigate();
  const menuItems = [
    { text: 'Ana Panel', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Ürünler', icon: <InventoryIcon />, path: '/products' },
    { text: 'Envanter', icon: <InventoryIcon />, path: '/inventory' },
    { text: 'Kategoriler', icon: <CategoryIcon />, path: '/categories' },
    { text: 'Vergiler', icon: <PercentIcon />, path: '/taxes' },
    { text: 'Masa Yönetimi', icon: <TableRestaurantIcon />, path: '/tables' },
    { text: 'Şubeler', icon: <StorefrontIcon />, path: '/branches' },
    { text: 'Mutfak', icon: <KitchenIcon />, path: '/kitchen' },
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

