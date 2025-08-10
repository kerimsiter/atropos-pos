// packages/atropos-desktop/src/renderer/src/pages/OrderPage.tsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, Paper, Typography, Button, Box, List, ListItem, ListItemText, Divider, IconButton, Chip, Autocomplete, TextField } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline, DeleteForever } from '@mui/icons-material';
import api from '../api';
import { Category } from '../types/Category';
import { Product } from '../types/Product';
import { PaymentModal } from '../components/payments/PaymentModal';
import { toast } from 'react-hot-toast';

interface OrderItem extends Product {
  quantity: number;
  orderItemId?: string; // server-side order item id for updates/deletes
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
  const [activeOrderStatus, setActiveOrderStatus] = useState<string | null>(null);
  const [activeOrderCustomerId, setActiveOrderCustomerId] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Array<{ id: string; firstName?: string | null; lastName?: string | null; phone?: string | null }>>([]);
  const [customerLoading, setCustomerLoading] = useState(false);
  const isConfirmed = activeOrderStatus === 'CONFIRMED';

  const selectedCustomer = useMemo(() => customers.find(c => c.id === activeOrderCustomerId) || null, [customers, activeOrderCustomerId]);

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
            orderItemId: it.id,
          } as OrderItem;
        });
        setOrderItems(mapped);
        setActiveOrderId(data.id);
        setActiveOrderStatus(data.status ?? null);
        setActiveOrderCustomerId(data.customerId ?? null);
      } else {
        setOrderItems([]);
        setActiveOrderId(null);
        setActiveOrderStatus(null);
        setActiveOrderCustomerId(null);
      }
    } catch (err) {
      console.error('Aktif sipariş getirilirken hata:', err);
      toast.error('Aktif sipariş yüklenemedi');
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
        // müşterileri yükle (lightweight list for selection)
        setCustomerLoading(true);
        try {
          const custRes = await api.get('/customers');
          setCustomers(custRes.data || []);
        } finally {
          setCustomerLoading(false);
        }
      } catch (error) {
        console.error('Kategori veya ürünler getirilirken hata:', error);
      }
    };
    fetchData();
  }, []);

  const handleAssignCustomer = async (customerId: string | null) => {
    if (!activeOrderId) {
      toast.error('Aktif bir sipariş yok');
      return;
    }
    try {
      await api.patch(`/orders/${activeOrderId}/customer`, { customerId });
      setActiveOrderCustomerId(customerId);
      toast.success(customerId ? 'Müşteri atandı' : 'Müşteri kaldırıldı');
    } catch (e) {
      console.error('Müşteri atanırken hata:', e);
      toast.error('Müşteri atanamadı');
    }
  };

  const handleRemoveItem = async (id: string) => {
    if (isConfirmed) {
      toast.error('Onaylanmış siparişte değişiklik yapılamaz');
      return;
    }
    try {
      if (activeOrderId) {
        await api.delete(`/orders/${activeOrderId}/items/${id}`);
      } else {
        // local mode: remove from local state
        setOrderItems((prev) => prev.filter((it) => (it.orderItemId ?? it.id) !== id));
        return;
      }
      await loadActiveOrder();
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Bilinmeyen hata';
      console.error('Ürün silinirken hata:', msg, error?.response?.data);
      toast.error(String(msg));
    }
  };

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (isConfirmed) {
      toast.error('Onaylanmış siparişte değişiklik yapılamaz');
      return;
    }
    if (newQuantity <= 0) {
      await handleRemoveItem(id);
      return;
    }
    try {
      if (activeOrderId) {
        await api.patch(`/orders/${activeOrderId}/items/${id}`, { quantity: newQuantity });
      } else {
        // local mode: update in place
        setOrderItems((prev) => prev.map((it) => (it.orderItemId ?? it.id) === id ? { ...it, quantity: newQuantity } : it));
        return;
      }
      await loadActiveOrder();
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Bilinmeyen hata';
      console.error('Miktar güncellenirken hata:', msg, error?.response?.data);
      toast.error(String(msg));
    }
  };

  const handleAddProduct = async (product: Product) => {
    if (isConfirmed) {
      toast.error('Onaylanmış siparişe ürün eklenemez');
      return;
    }
    // Always persist to server (implicit create/merge) when we know the tableId
    if (tableId) {
      try {
        await api.post('/orders', {
          tableId: tableId,
          items: [
            {
              productId: product.id,
              quantity: 1,
              unitPrice: Number(product.basePrice),
            },
          ],
        });
        await loadActiveOrder();
        return;
      } catch (error) {
        console.error('Ürün eklenirken (implicit create/merge) hata:', error);
        toast.error('Ürün eklenemedi');
        // fallthrough to local as a graceful degradation
      }
    }
    // Local fallback (should rarely happen if tableId is always present)
    setOrderItems((prevItems) => {
      const itemExists = prevItems.find((item) => item.id === product.id);
      if (itemExists) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const handleSubmitOrder = async () => {
    // New role: confirm/approve the existing active order so it goes to kitchen
    if (!activeOrderId) {
      toast.error('Henüz sipariş yok. Önce ürün ekleyin.');
      return;
    }
    try {
      await api.patch(`/orders/${activeOrderId}/confirm`);
      await loadActiveOrder();
      toast.success('Sipariş onaylandı!');
    } catch (error) {
      console.error('Sipariş onaylanırken hata oluştu:', error);
      toast.error('Sipariş onaylanamadı!');
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" gutterBottom>Masa #{tableId} Adisyon</Typography>
            {activeOrderStatus && (
              <Chip
                label={activeOrderStatus === 'CONFIRMED' ? 'Onaylandı' : 'Beklemede'}
                color={activeOrderStatus === 'CONFIRMED' ? 'success' : 'default'}
                size="small"
              />
            )}
          </Box>
          <Box sx={{ mb: 2 }}>
            <Autocomplete
              size="small"
              loading={customerLoading}
              options={customers}
              getOptionLabel={(opt) => `${opt.firstName ?? ''} ${opt.lastName ?? ''}`.trim() || (opt.phone ?? '') || '-'}
              value={selectedCustomer}
              onChange={(_e, val) => handleAssignCustomer(val?.id ?? null)}
              renderInput={(params) => <TextField {...params} label="Müşteri Ata" placeholder="İsim/Telefon" />}
              disabled={!activeOrderId || isConfirmed}
              isOptionEqualToValue={(o, v) => o.id === v.id}
            />
            {selectedCustomer && (
              <Button variant="text" color="warning" size="small" sx={{ mt: 0.5 }} onClick={() => handleAssignCustomer(null)} disabled={isConfirmed}>
                Atamayı Kaldır
              </Button>
            )}
          </Box>
          <List sx={{ maxHeight: '60vh', overflow: 'auto' }}>
            {orderItems.map((item, idx) => (
              <ListItem
                key={`${item.orderItemId ?? item.id}-${idx}`}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => item.orderItemId && handleRemoveItem(item.orderItemId)} disabled={isConfirmed}>
                    <DeleteForever color="error" />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={item.name}
                  secondary={`${(item.basePrice * item.quantity).toFixed(2)} TL`}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton size="small" onClick={() => handleUpdateQuantity((item.orderItemId ?? item.id), item.quantity - 1)} disabled={isConfirmed}>
                    <RemoveCircleOutline />
                  </IconButton>
                  <Typography variant="body1">{item.quantity}</Typography>
                  <IconButton size="small" onClick={() => handleUpdateQuantity((item.orderItemId ?? item.id), item.quantity + 1)} disabled={isConfirmed}>
                    <AddCircleOutline />
                  </IconButton>
                </Box>
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
            disabled={!activeOrderId || isConfirmed}
          >
            Siparişi Onayla
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
        customerId={activeOrderCustomerId}
        onSuccess={async () => {
          // after payment, navigate back to tables
          setPaymentOpen(false);
          navigate('/tables');
        }}
      />
    </Grid>
  );
}
