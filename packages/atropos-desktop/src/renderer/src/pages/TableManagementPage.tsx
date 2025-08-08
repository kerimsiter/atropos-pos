import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Divider } from '@mui/material';
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

  const fetchData = async () => {
    try {
      const [areasResponse, tablesResponse] = await Promise.all([
        api.get('/table-areas'),
        api.get('/tables'),
      ]);
      setTableAreas(areasResponse.data);
      setTables(tablesResponse.data);
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
        // merge/replace the latest active order
        table.orders = [{ ...(current && current.id === order.id ? { ...current, ...order } : order) }];
        // optionally mark occupied on confirmed
        if (order.status && typeof order.status === 'string' && order.status.toUpperCase() === 'CONFIRMED') {
          table.status = 'OCCUPIED';
        }
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

  const handleUpdatePosition = async (id: string, x: number, y: number) => {
    try {
      await api.patch(`/tables/${id}/position`, { positionX: x, positionY: y });
      // İsteğe bağlı: Pozisyonu local state'de de güncelleyebiliriz,
      // ancak en sağlamı veriyi yeniden çekmektir.
      const tablesResponse = await api.get('/tables');
      setTables(tablesResponse.data);
    } catch (error) {
      console.error('Masa pozisyonu güncellenirken hata:', error);
    }
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Görsel Masa Yönetimi
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={() => setIsAreaModalOpen(true)}>
            Yeni Alan Ekle
          </Button>
          <Button variant="contained" onClick={() => setIsModalOpen(true)}>
            Yeni Masa Ekle
          </Button>
        </Box>
      </Box>

      {tableAreas.map((area) => (
        <Paper key={area.id} elevation={2} sx={{ mb: 4, p: 2, position: 'relative', minHeight: 400 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>{area.name}</Typography>
          <Divider sx={{ mb: 2 }}/>
          <Box sx={{ position: 'relative', height: '100%' }}>
            {tables
              .filter((table) => table.areaId === area.id)
              .map((table) => (
                <TableCard key={table.id} table={table} onStop={handleUpdatePosition} />
              ))}
          </Box>
        </Paper>
      ))}

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
