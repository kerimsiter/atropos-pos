// packages/atropos-desktop/src/renderer/src/pages/OrderPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, Paper, Typography, Button, Box, List, ListItem, ListItemText, Divider } from '@mui/material';
import api from '../api';
import { Category } from '../types/Category';
import { Product } from '../types/Product';
import { PaymentModal } from '../components/payments/PaymentModal';

interface OrderItem extends Product {
  quantity: number;
}

export default function OrderPage() {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const loadActiveOrder = async () => {
    if (!tableId) return;
    try {
      const { data } = await api.get(`/orders/active-by-table/${tableId}`);
      if (data && Array.isArray(data.items)) {
        const mapped: OrderItem[] = data.items.map((it: any) => {
          const p = it.product ?? {};
          return {
            id: p.id ?? it.productId,
            name: p.name ?? 'Ürün',
            categoryId: p.categoryId ?? '',
            basePrice: Number(it.unitPrice ?? p.basePrice ?? 0),
            quantity: Number(it.quantity ?? 0),
          } as OrderItem;
        });
        setOrderItems(mapped);
        setActiveOrderId(data.id);
      } else {
        setOrderItems([]);
        setActiveOrderId(null);
      }
    } catch (err) {
      console.error('Aktif sipariş getirilirken hata:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products')
        ]);
        setCategories(catRes.data);
        setProducts(prodRes.data);
        if (catRes.data.length > 0) {
          setSelectedCategory(catRes.data[0]);
        }
        // mevcut aktif siparişi yükle
        await loadActiveOrder();
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
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const handleSubmitOrder = async () => {
    if (orderItems.length === 0 || !tableId) {
      alert("Lütfen siparişe ürün ekleyin.");
      return;
    }

    const payload = {
      tableId: tableId,
      items: orderItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: Number(item.basePrice),
      })),
    };

    try {
      await api.post('/orders', payload);
      alert(`Masa #${tableId} için sipariş başarıyla oluşturuldu!`);
      // Navigasyon yerine aktif siparişi yeniden yükleyip ekranda göster
      await loadActiveOrder();
    } catch (error) {
      console.error("Sipariş gönderilirken hata oluştu:", error);
      alert("Sipariş oluşturulamadı!");
    }
  };
  
  const filteredProducts = products.filter(p => p.categoryId === selectedCategory?.id);
  const total = orderItems.reduce((sum, item) => sum + (item.basePrice * item.quantity), 0);

  return (
    <Grid container spacing={2}>
      {/* Sol Sütun: Menü */}
      <Grid size={8}>
        <Paper sx={{ p: 1, mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {categories.map((cat) => (
            <Button key={cat.id} variant={selectedCategory?.id === cat.id ? 'contained' : 'outlined'} onClick={() => setSelectedCategory(cat)}>
              {cat.name}
            </Button>
          ))}
        </Paper>
        <Grid container spacing={2}>
          {filteredProducts.map((prod) => (
            <Grid size={{ xs: 4, sm: 3, md: 2 }} key={prod.id}>
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
      <Grid size={4}>
        <Paper sx={{ p: 2, position: 'sticky', top: '80px' }}>
          <Typography variant="h5" gutterBottom>Masa #{tableId} Adisyon</Typography>
          <List sx={{ maxHeight: '60vh', overflow: 'auto' }}>
            {orderItems.map((item, idx) => (
              <ListItem key={`${item.id}-${idx}`}>
                <ListItemText primary={`${item.name} x${item.quantity}`} secondary={`${(item.basePrice * item.quantity).toFixed(2)} TL`} />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">TOPLAM:</Typography>
            <Typography variant="h6">{total.toFixed(2)} TL</Typography>
          </Box>
          <Button 
            variant="contained" 
            color="success" 
            fullWidth sx={{ mt: 2 }}
            onClick={handleSubmitOrder}
            disabled={orderItems.length === 0}
          >
            Siparişi Gönder
          </Button>
          <Button 
            variant="outlined" 
            color="primary" 
            fullWidth sx={{ mt: 1 }}
            onClick={() => setPaymentOpen(true)}
            disabled={!activeOrderId || orderItems.length === 0}
          >
            Ödeme Al
          </Button>
        </Paper>
      </Grid>
      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        orderId={activeOrderId || ''}
        totalAmount={total}
        onSuccess={async () => {
          // after payment, navigate back to tables
          setPaymentOpen(false);
          navigate('/tables');
        }}
      />
    </Grid>
  );
}
