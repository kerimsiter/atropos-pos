// packages/atropos-desktop/src/renderer/src/pages/CategoriesPage.tsx
import { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import api from '../api';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { AddCategoryModal } from '../components/categories/AddCategoryModal'; // Eklendi

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Eklendi

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error("Kategoriler çekilirken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  
  const handleDelete = async (id: string) => {
    if (window.confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
      } catch (error) {
        alert("Kategori silinemedi. Bu kategoriye bağlı ürünler olabilir.");
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Kategori Adı', width: 250 },
    {
      field: 'parent',
      headerName: 'Üst Kategori',
      width: 250,
      valueGetter: (_value, row) => row.parent?.name || '---',
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton onClick={() => handleDelete(params.row.id)} color="error">
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ height: '85vh', width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">Kategori Yönetimi</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsModalOpen(true)}> {/* onClick eklendi */}
            Yeni Kategori Ekle
          </Button>
        </Box>
        <DataGrid
            rows={categories}
            columns={columns}
            loading={loading}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 25, 50]}
        />
      </Box>
      <AddCategoryModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchCategories();
        }}
      />
    </>
  );
}

