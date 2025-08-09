// packages/atropos-desktop/src/renderer/src/pages/DashboardPage.tsx
import { useState, useEffect } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';
import api from '../api';
import { StatCard } from '../components/dashboard/StatCard';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get('/dashboard/stats');
        setStats(data);
      } catch (err) {
        setError('Dashboard verileri yüklenemedi.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        Ana Panel
      </Typography>
      
      {/* Özet Kartları */}
      <Box
        sx={{
          mb: 3,
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
        }}
      >
        <StatCard
          title="Bugünkü Ciro"
          value={`${Number(stats?.todaysRevenue || 0).toFixed(2)} TL`}
          icon={<PointOfSaleIcon color="success" />}
        />
        <StatCard
          title="Tamamlanan Sipariş"
          value={stats?.todaysOrders || 0}
          icon={<ReceiptLongIcon color="info" />}
        />
        <StatCard
          title="Açık Masa"
          value={stats?.openTables || 0}
          icon={<TableRestaurantIcon color="warning" />}
        />
      </Box>

      {/* En Çok Satan Ürünler */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Paper sx={{ p: 2.5 }}>
          <Typography variant="h6" gutterBottom>En Çok Satan Ürünler (Bugün)</Typography>
          <List>
            {stats?.topProducts?.length > 0 ? (
              stats.topProducts.map((product: any) => (
                <ListItem key={product.productId} disablePadding>
                  <ListItemText 
                    primary={product.name} 
                    secondary={`${Number(product.quantity || 0)} adet satıldı`} 
                  />
                </ListItem>
              ))
            ) : (
              <Typography>Bugün hiç ürün satılmadı.</Typography>
            )}
          </List>
        </Paper>
      </Box>
    </Box>
  );
}

