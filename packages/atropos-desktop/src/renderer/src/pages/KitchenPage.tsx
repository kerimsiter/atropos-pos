import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Box, Paper, Typography, Chip, Grid } from '@mui/material';
import api from '../api';

interface OrderItemDTO {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

interface OrderDTO {
  id: string;
  tableId: string;
  status: string;
  orderNumber?: string;
  totalAmount: number;
  items: OrderItemDTO[];
}

export default function KitchenPage() {
  const [orders, setOrders] = useState<OrderDTO[]>([]);

  useEffect(() => {
    // Bootstrap: fetch current kitchen-visible orders
    api.get('/orders/kitchen')
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setOrders((prev) => {
          // merge unique by id, keep latest first
          const map = new Map<string, OrderDTO>();
          [...list, ...prev].forEach((o: any) => map.set(o.id, o));
          return Array.from(map.values());
        });
      })
      .catch(() => {
        // ignore bootstrap errors in UI
      });

    // Connect to the backend WebSocket (Socket.IO)
    const url = 'http://localhost:3000';
    // Use default transports (polling + upgrade) for broader compatibility
    const socket: Socket = io(url);
    const refetch = () => {
      api.get('/orders/kitchen')
        .then((res) => {
          const list = Array.isArray(res.data) ? res.data : [];
          setOrders(() => list);
        })
        .catch(() => {});
    };
    socket.on('connect', refetch);
    socket.on('reconnect', refetch);

    const onNewOrder = (order: OrderDTO) => {
      setOrders((prev) => {
        // prevent duplicates
        const exists = prev.some((o) => o.id === order.id);
        if (exists) {
          // replace if already exists (in case of re-emit)
          return prev.map((o) => (o.id === order.id ? order : o));
        }
        return [order, ...prev];
      });
    };
    const onOrderStatusUpdated = (order: OrderDTO) => {
      const visible = ['CONFIRMED', 'PREPARING', 'READY', 'SERVING'];
      // If order left KDS-visible states, remove it
      if (!visible.includes(String(order.status).toUpperCase())) {
        setOrders((prev) => prev.filter((o) => o.id !== order.id));
        return;
      }
      setOrders((prev) => {
        const idx = prev.findIndex((o) => o.id === order.id);
        if (idx === -1) {
          // out-of-sync: refetch once
          refetch();
          return prev;
        }
        return prev.map((o) => (o.id === order.id ? order : o));
      });
    };

    socket.on('connect', () => {
      // console.log('KDS connected', socket.id);
    });
    socket.on('new_order', onNewOrder);
    socket.on('order_status_updated', onOrderStatusUpdated);

    return () => {
      socket.off('new_order', onNewOrder);
      socket.off('order_status_updated', onOrderStatusUpdated);
      socket.off('connect', refetch);
      socket.off('reconnect', refetch);
      socket.disconnect();
    };
  }, []);

  const setStatus = async (orderId: string, status: 'PREPARING' | 'READY') => {
    try {
      const { data } = await api.patch(`/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => (o.id === data.id ? data : o)));
    } catch (e) {
      // noop: could toast in future
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Mutfak Ekranı</Typography>
      <Grid container spacing={2}>
        {orders.map((order) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={order.id}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6">{order.orderNumber || order.id.slice(0, 8)}</Typography>
                <Chip label={order.status} color={order.status === 'CONFIRMED' ? 'warning' : order.status === 'PREPARING' ? 'info' : order.status === 'READY' ? 'success' : 'default'} size="small" />
              </Box>
              <Typography variant="subtitle2" gutterBottom>Masa: {order.tableId}</Typography>
              {order.items?.map((it) => (
                <Box key={it.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">x{it.quantity}</Typography>
                  <Typography variant="body2">{Number(it.totalAmount ?? 0).toFixed(2)} TL</Typography>
                </Box>
              ))}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="subtitle2">Toplam</Typography>
                <Typography variant="subtitle2">{Number(order.totalAmount ?? 0).toFixed(2)} TL</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                {order.status === 'CONFIRMED' && (
                  <Chip clickable color="info" label="Hazırlamaya Başla" onClick={() => setStatus(order.id, 'PREPARING')} />
                )}
                {order.status === 'PREPARING' && (
                  <Chip clickable color="success" label="Sipariş Hazır" onClick={() => setStatus(order.id, 'READY')} />
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
