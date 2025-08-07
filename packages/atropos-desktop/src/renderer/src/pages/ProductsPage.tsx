// packages/atropos-desktop/src/renderer/src/pages/ProductsPage.tsx
import { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import api from '../api';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit'; // Eklendi
import { AddProductModal } from '../components/products/AddProductModal';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // Eklendi

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error("Ürünler çekilirken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts(); // Listeyi yenile
      } catch (error) {
        console.error("Ürün silinirken hata:", error);
      }
    }
  };
  
  // Düzenleme modalını açan fonksiyon
  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };
  
  // Ekleme modalını açan fonksiyon
  const handleAdd = () => {
    setEditingProduct(null); // Düzenleme modunda olmadığımızdan emin ol
    setIsModalOpen(true);
  };
  
  const handleModalClose = () => {
      setIsModalOpen(false);
      setEditingProduct(null); // Modalı kapatırken düzenleme durumunu sıfırla
  }

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Ürün Adı', width: 250 },
    { field: 'code', headerName: 'SKU', width: 150 },
    { field: 'basePrice', headerName: 'Fiyat', width: 130, type: 'number' },
    { 
      field: 'category', 
      headerName: 'Kategori', 
      width: 180,
      valueGetter: (_value, row) => row.category?.name || 'N/A'
    },
    { 
      field: 'tax', 
      headerName: 'Vergi', 
      width: 150,
      valueGetter: (_value, row) => row.tax?.name || 'N/A'
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      width: 120, // Genişlik artırıldı
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
          <Typography variant="h4">Ürün Yönetimi</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
            Yeni Ürün Ekle
          </Button>
        </Box>
        <DataGrid rows={products} columns={columns} loading={loading} />
      </Box>

      <AddProductModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSuccess={fetchProducts}
        productToEdit={editingProduct} // Düzenlenecek ürünü prop olarak gönder
      />
    </>
  );
}
