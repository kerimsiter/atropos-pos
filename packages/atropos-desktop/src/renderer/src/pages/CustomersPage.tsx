// packages/atropos-desktop/src/renderer/src/pages/CustomersPage.tsx
import { useEffect, useState } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../api';
import { AddCustomerModal } from '../components/customers/AddCustomerModal';
import { useNavigate } from 'react-router-dom';

interface Customer {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  phone: string;
  email?: string | null;
  totalSpent?: number | null;
}

export default function CustomersPage() {
  const [rows, setRows] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/customers');
      setRows(res.data);
    } catch (e) {
      console.error('Müşteriler çekilirken hata:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setEditing(null);
    setOpenModal(true);
  };

  const handleEdit = (row: Customer) => {
    setEditing(row);
    setOpenModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu müşteriyi silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/customers/${id}`);
      fetchData();
    } catch (e) {
      console.error('Müşteri silinirken hata:', e);
      alert('Müşteri silinemedi');
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'fullName',
      headerName: 'Ad Soyad',
      flex: 1,
      renderCell: (params) => {
        const name = `${params.row.firstName || ''} ${params.row.lastName || ''}`.trim() || '-';
        return (
          <Button variant="text" onClick={() => navigate(`/customers/${params.row.id}`)} sx={{ textTransform: 'none', p: 0 }}>
            {name}
          </Button>
        );
      },
    },
    { field: 'phone', headerName: 'Telefon', width: 180 },
    { field: 'email', headerName: 'E-posta', width: 220 },
    {
      field: 'totalSpent',
      headerName: 'Toplam Harcama',
      width: 160,
      type: 'number',
      valueGetter: (_v, row) => row.totalSpent ?? 0,
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}><EditIcon /></IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}><DeleteIcon /></IconButton>
        </Box>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ width: '100%', height: '85vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">Müşteri Yönetimi</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>Yeni Müşteri</Button>
        </Box>
        <DataGrid rows={rows} columns={columns} loading={loading} />
      </Box>

      <AddCustomerModal
        open={openModal}
        onClose={() => { setOpenModal(false); setEditing(null); }}
        onSuccess={fetchData}
        customerToEdit={editing}
      />
    </>
  );
}
