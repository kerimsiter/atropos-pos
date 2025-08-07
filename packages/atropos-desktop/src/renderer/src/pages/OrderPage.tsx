// packages/atropos-desktop/src/renderer/src/pages/OrderPage.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Paper, Typography, Button, Box, List, ListItem, ListItemText, Divider } from '@mui/material';
import api from '../api';
import { Category } from '../types/Category';
import { Product } from '../types/Product';

interface OrderItem extends Product {
  quantity: number;
}

export default function OrderPage() {
  const { tableId } = useParams(); // URL'den masa ID'sini al
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]); // Adisyon listesi

  useEffect(() => {
    // Sayfa yüklendiğinde kategorileri ve ürünleri çek
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products')
        ]);
        setCategories(catRes.data);
        setProducts(prodRes.data);
        if (catRes.data.length > 0) {
          setSelectedCategory(catRes.data[0]); // İlk kategoriyi seçili yap
        }
      } catch (error) {
        console.error('Kategori veya ürünler getirilirken hata:', error);
      }
    };
    fetchData();
  }, []);

  const handleAddProduct = (product: Product) => {
    setOrderItems((prevItems) => {
      const itemExists = prevItems.find(item => item.id === product.id);
      if (itemExists) {
        // Ürün zaten varsa miktarını artır
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Ürün yoksa listeye ekle
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };
  
  const filteredProducts = products.filter(p => p.categoryId === selectedCategory?.id);
  const total = orderItems.reduce((sum, item) => sum + (item.basePrice * item.quantity), 0);

  return (
    <Grid container spacing={2}>
      {/* Sol Sütun: Menü */}
      <Grid item xs={8}>
        <Paper sx={{ p: 1, mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {categories.map((cat) => (
            <Button key={cat.id} variant={selectedCategory?.id === cat.id ? 'contained' : 'outlined'} onClick={() => setSelectedCategory(cat)}>
              {cat.name}
            </Button>
          ))}
        </Paper>
        <Grid container spacing={2}>
          {filteredProducts.map((prod) => (
            <Grid item xs={4} sm={3} md={2} key={prod.id}>
              <Paper
                onClick={() => handleAddProduct(prod)}
                sx={{ p: 2, textAlign: 'center', cursor: 'pointer', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Typography variant="body2">{prod.name}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* Sağ Sütun: Adisyon */}
      <Grid item xs={4}>
        <Paper sx={{ p: 2, position: 'sticky', top: '80px' }}>
          <Typography variant="h5" gutterBottom>Masa #{tableId} Adisyon</Typography>
          <List sx={{ maxHeight: '60vh', overflow: 'auto' }}>
            {orderItems.map((item) => (
              <ListItem key={item.id}>
                <ListItemText primary={`${item.name} x${item.quantity}`} secondary={`${(item.basePrice * item.quantity).toFixed(2)} TL`} />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">TOPLAM:</Typography>
            <Typography variant="h6">{total.toFixed(2)} TL</Typography>
          </Box>
          <Button variant="contained" color="success" fullWidth sx={{ mt: 2 }}>
            Siparişi Gönder
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
}
