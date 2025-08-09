// packages/atropos-desktop/src/renderer/src/components/Sidebar.tsx
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import PercentIcon from '@mui/icons-material/Percent';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import StorefrontIcon from '@mui/icons-material/Storefront';
import KitchenIcon from '@mui/icons-material/Kitchen';
import { useLayoutStore } from '../store/layoutStore';

const drawerWidth = 240;

export const Sidebar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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

  const openedMixin = (theme: any) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  });

  const closedMixin = (theme: any) => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
  });

  const { isSidebarOpen, toggleSidebar } = useLayoutStore();

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? isSidebarOpen : true}
      onClose={isMobile ? toggleSidebar : undefined}
      ModalProps={{ keepMounted: true }}
      sx={(theme) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(isSidebarOpen && !isMobile && {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!isSidebarOpen && !isMobile && {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        }),
      })}
    >
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{ minHeight: 48, justifyContent: isSidebarOpen || isMobile ? 'initial' : 'center', px: 2.5 }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: isSidebarOpen || isMobile ? 3 : 'auto', justifyContent: 'center' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ opacity: isSidebarOpen || isMobile ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

