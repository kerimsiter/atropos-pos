import { useEffect, useState } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import api from '../api';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { AddInventoryItemModal } from '../components/inventory/AddInventoryItemModal';

export default function InventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get('/inventory-items');
      setItems(res.data);
    } catch (e) {
      console.error('Envanter listesi alınamadı', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu kaydı silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/inventory-items/${id}`);
      fetchItems();
    } catch (e) {
      console.error('Silme hatası', e);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Ad', width: 220 },
    { field: 'code', headerName: 'Kod', width: 140 },
    { field: 'unit', headerName: 'Birim', width: 120 },
    { field: 'currentStock', headerName: 'Stok', width: 140 },
    { field: 'criticalLevel', headerName: 'Kritik Seviye', width: 160 },
    {
      field: 'actions',
      headerName: 'İşlemler',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleEdit(params.row)} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ height: '85vh', width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">Envanter Yönetimi</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
            Yeni Kalem Ekle
          </Button>
        </Box>
        <DataGrid rows={items} columns={columns} loading={loading} />
      </Box>

      <AddInventoryItemModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSuccess={fetchItems}
        itemToEdit={editingItem}
      />
    </>
  );
}
