import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Divider, List, ListItem, ListItemText, Avatar } from '@mui/material';
import api from '../api';
import { AddTableModal } from '../components/tables/AddTableModal';
import { AddTableAreaModal } from '../components/table-areas/AddTableAreaModal';
import { TableCard } from '../components/tables/TableCard';
import { Table } from '../types/Table';
import { TableArea } from '../types/TableArea';
import { io, Socket } from 'socket.io-client';

const TableManagementPage = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [tableAreas, setTableAreas] = useState<TableArea[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [occupiedOnly, setOccupiedOnly] = useState(false);

  const fetchData = async () => {
    try {
      const [areasResponse, tablesResponse] = await Promise.all([
        api.get('/table-areas'),
        api.get('/tables'),
      ]);
      setTableAreas(areasResponse.data);
      setTables(tablesResponse.data);
      if (!selectedAreaId && areasResponse.data?.length) {
        setSelectedAreaId(areasResponse.data[0].id);
      }
    } catch (error) {
      console.error('Veri getirilirken hata oluştu:', error);
    }
  };

  useEffect(() => {
    fetchData();

    // Real-time: listen order events to reflect on table cards
    const socket: Socket = io('http://localhost:3000');
    socket.on('connect', () => {
      // Late connects get a fresh snapshot
      fetchData();
    });
    socket.on('reconnect', () => {
      fetchData();
    });
    const onNewOrder = (order: any) => {
      // console.debug('[TM] new_order', order);
      setTables((prev) => {
        const idx = prev.findIndex((t) => t.id === order.tableId);
        if (idx === -1) {
          // Possibly out-of-sync list; refresh once
          fetchData();
          return prev;
        }
        const copy = [...prev];
        const table = { ...copy[idx] } as Table;
        const current = table.orders?.[0];
        // merge/replace the latest active order (tablo durumunu backend belirlesin)
        table.orders = [{ ...(current && current.id === order.id ? { ...current, ...order } : order) }];
        copy[idx] = table;
        return copy;
      });
    };
    const onOrderStatusUpdated = (order: any) => {
      // console.debug('[TM] order_status_updated', order);
      setTables((prev) => {
        const idx = prev.findIndex((t) => t.id === order.tableId);
        if (idx === -1) {
          fetchData();
          return prev;
        }
        const copy = [...prev];
        const table = { ...copy[idx] } as Table;
        const current = table.orders?.[0];
        if (current && current.id === order.id) {
          table.orders = [{ ...current, ...order }];
        } else {
          table.orders = [{ ...(order || current) }];
        }
        copy[idx] = table;
        return copy;
      });
    };
    socket.on('new_order', onNewOrder);
    socket.on('order_status_updated', onOrderStatusUpdated);
    return () => {
      socket.off('new_order', onNewOrder);
      socket.off('order_status_updated', onOrderStatusUpdated);
      socket.disconnect();
    };
  }, []);

  // Drag & drop kaldırıldı: pozisyon güncellemesi devre dışı
  
  // Görüntülenecek masalar: DOLU MASALAR kısayolu aktifse alan bağımsız OCCUPIED
  const visibleTables = occupiedOnly
    ? tables.filter((t) => String(t.status || '').toUpperCase() === 'OCCUPIED')
    : tables.filter((t) => (selectedAreaId ? t.areaId === selectedAreaId : true));
  const activeOrders = visibleTables
    .map((t) => ({ table: t, order: (t as any)?.orders?.[0] || null }))
    .filter((x) => !!x.order) as { table: Table; order: any }[];
  const totalAmount = activeOrders.reduce((sum, x) => sum + Number(x.order?.totalAmount || 0), 0);

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      {/* Sol: Aktif Adisyonlar */}
      <Paper elevation={0} sx={{ width: 300, p: 2, borderRadius: 2, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>Adisyonlar</Typography>
        <Divider sx={{ mb: 1 }} />
        <List dense sx={{ flex: 1, overflowY: 'auto' }}>
          {activeOrders.length === 0 && (
            <ListItem>
              <ListItemText primary="Aktif adisyon yok" primaryTypographyProps={{ color: 'text.secondary' }} />
            </ListItem>
          )}
          {activeOrders.map(({ table, order }, idx) => {
            const timeTxt = order?.createdAt ? new Date(order.createdAt).toLocaleTimeString() : '';
            const amountTxt = `₺${Number(order?.totalAmount || 0).toFixed(2)}`;
            return (
              <ListItem key={order.id} sx={{ borderRadius: 1, mb: 0.5, px: 1, '&:hover': { backgroundColor: 'grey.100' } }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '32px 1fr auto', alignItems: 'center', gap: 1, width: '100%' }}>
                  <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.light', color: 'text.primary', fontSize: 12, fontWeight: 700 }}>{idx + 1}</Avatar>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{`Masa ${table.number}`}</Typography>
                    <Typography variant="caption" color="text.secondary">{timeTxt}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>{amountTxt}</Typography>
                </Box>
              </ListItem>
            );
          })}
        </List>
        <Divider sx={{ mt: 1, mb: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="overline" color="text.secondary">TOPLAM</Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>₺{totalAmount.toFixed(2)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Button variant="outlined" onClick={() => setIsAreaModalOpen(true)}>Yeni Alan</Button>
          <Button variant="contained" onClick={() => setIsModalOpen(true)}>Yeni Masa</Button>
        </Box>
      </Paper>

      {/* Orta: Masa Grid */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 0.5 }}>
          <Typography variant="overline" color="text.secondary">Katlar</Typography>
          <Typography variant="body2">›</Typography>
          <Typography variant="overline" color="text.primary">{occupiedOnly ? 'DOLU MASALAR' : (tableAreas.find(a => a.id === selectedAreaId)?.name || '—')}</Typography>
        </Box>
        <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(180px, 1fr))', gap: 1.5 }}>
            {visibleTables.map((table) => (
              <TableCard key={table.id} table={table} />
            ))}
          </Box>
        </Paper>
      </Box>

      {/* Sağ: Alan Seçici ve Hızlı Filtre */}
      <Paper elevation={0} sx={{ width: 220, p: 2, borderRadius: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>Alanlar</Typography>
        <Divider sx={{ mb: 1 }} />
        <Box sx={{ display: 'flex', mb: 1 }}>
          <Button
            size="small"
            variant={occupiedOnly ? 'contained' : 'outlined'}
            color={occupiedOnly ? 'primary' : 'inherit'}
            onClick={() => setOccupiedOnly((v) => !v)}
            sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 700 }}
          >
            DOLU MASALAR
          </Button>
        </Box>
        <List dense>
          {tableAreas.map((area) => {
            const selected = area.id === selectedAreaId;
            return (
              <ListItem
                key={area.id}
                onClick={() => { setSelectedAreaId(area.id); setOccupiedOnly(false); }}
                sx={{
                  borderRadius: 999,
                  mb: 0.5,
                  cursor: 'pointer',
                  px: 1.25,
                  backgroundColor: selected ? 'primary.main' : 'transparent',
                  color: selected ? 'primary.contrastText' : 'inherit',
                  '&:hover': { backgroundColor: selected ? 'primary.dark' : 'grey.100' },
                }}
              >
                <ListItemText primary={area.name} primaryTypographyProps={{ fontWeight: selected ? 700 : 500 }} />
              </ListItem>
            );
          })}
        </List>
      </Paper>

      {/* Modallar */}
      <AddTableModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tableAreas={tableAreas}
        onSuccess={() => {
          fetchData();
          setIsModalOpen(false);
        }}
      />

      <AddTableAreaModal
        open={isAreaModalOpen}
        onClose={() => setIsAreaModalOpen(false)}
        onSuccess={() => {
          fetchData();
          setIsAreaModalOpen(false);
        }}
      />
    </Box>
  );
};

export default TableManagementPage;
