// packages/atropos-desktop/src/renderer/src/pages/TaxesPage.tsx
import { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import api from '../api';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { AddTaxModal } from '../components/taxes/AddTaxModal';

export default function TaxesPage() {
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTaxes = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/taxes');
      setTaxes(data);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTaxes(); }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Bu vergiyi silmek istediğinizden emin misiniz?")) {
      try {
        await api.delete(`/taxes/${id}`);
        fetchTaxes();
      } catch (error) { alert("Vergi silinemedi. Bu vergiye bağlı ürünler olabilir."); }
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Vergi Adı', width: 250 },
    { field: 'code', headerName: 'Kod', width: 150 },
    { field: 'rate', headerName: 'Oran (%)', width: 150, type: 'number' },
    {
      field: 'actions', headerName: 'İşlemler', width: 100, sortable: false,
      renderCell: (params) => ( <IconButton onClick={() => handleDelete(params.row.id)} color="error"><DeleteIcon /></IconButton> ),
    },
  ];

  return (
    <>
      <Box sx={{ height: '85vh', width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">Vergi Yönetimi</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsModalOpen(true)}>
            Yeni Vergi Ekle
          </Button>
        </Box>
        <DataGrid rows={taxes} columns={columns} loading={loading} />
      </Box>
      <AddTaxModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchTaxes} />
    </>
  );
}

