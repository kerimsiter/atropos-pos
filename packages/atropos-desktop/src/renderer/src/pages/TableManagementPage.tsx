import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Divider } from '@mui/material';
import api from '../api';
import { AddTableModal } from '../components/tables/AddTableModal';
import { TableCard } from '../components/tables/TableCard';
import { Table } from '../types/Table';
import { TableArea } from '../types/TableArea';

const TableManagementPage = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [tableAreas, setTableAreas] = useState<TableArea[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <Button variant="contained" onClick={() => setIsModalOpen(true)}>
          Yeni Masa Ekle
        </Button>
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
    </Box>
  );
};

export default TableManagementPage;
