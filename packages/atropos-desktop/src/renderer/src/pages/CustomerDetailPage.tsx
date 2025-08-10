// packages/atropos-desktop/src/renderer/src/pages/CustomerDetailPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';

interface Customer {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}

interface LoyaltyCard {
  id: string;
  cardNumber: string;
  points: number;
  balance: number;
  totalEarnedPoints: number;
  totalSpentPoints: number;
  transactions: LoyaltyTransaction[];
}

interface LoyaltyTransaction {
  id: string;
  type: string;
  points: number;
  pointBalance: number;
  amount?: number | null;
  moneyBalance?: number | null;
  baseAmount?: number | null;
  createdAt: string;
  description: string;
}

export default function CustomerDetailPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [card, setCard] = useState<LoyaltyCard | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchAll = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [cRes, lRes] = await Promise.all([
        api.get(`/customers/${id}`),
        api.get(`/customers/${id}/loyalty`),
      ]);
      setCustomer(cRes.data);
      setCard(lRes.data || null);
    } catch (e) {
      console.error('Müşteri detayları alınamadı:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCreateCard = async () => {
    if (!id) return;
    setCreating(true);
    try {
      await api.post('/loyalty/cards', { customerId: id });
      await fetchAll();
    } catch (e) {
      console.error('Sadakat kartı oluşturulamadı:', e);
      alert('Sadakat kartı oluşturulamadı');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!customer) {
    return <Typography>Müşteri bulunamadı.</Typography>;
  }

  const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || '-';

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Müşteri Detayı
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Temel Bilgiler</Typography>
              <Divider sx={{ my: 1 }} />
              <List dense>
                <ListItem>
                  <ListItemText primary="Ad Soyad" secondary={fullName} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Telefon" secondary={customer.phone || '-'} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="E-posta" secondary={customer.email || '-'} />
                </ListItem>
                {customer.address && (
                  <ListItem>
                    <ListItemText primary="Adres" secondary={customer.address} />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Sadakat Kartı</Typography>
                {!card && (
                  <Button variant="contained" onClick={handleCreateCard} disabled={creating}>
                    {creating ? 'Oluşturuluyor...' : 'Sadakat Kartı Oluştur'}
                  </Button>
                )}
              </Box>
              <Divider sx={{ my: 1 }} />
              {card ? (
                <Box>
                  <Typography>Kart No: {card.cardNumber}</Typography>
                  <Typography>Puan: {card.points}</Typography>
                  <Typography>Bakiye: {Number(card.balance).toFixed(2)} ₺</Typography>
                  <Typography>Toplam Kazanılan Puan: {card.totalEarnedPoints}</Typography>
                  <Typography>Toplam Harcanan Puan: {card.totalSpentPoints}</Typography>
                </Box>
              ) : (
                <Typography>Bu müşterinin henüz bir sadakat kartı yok.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">İşlem Geçmişi</Typography>
              <Divider sx={{ my: 1 }} />
              {!card || card.transactions.length === 0 ? (
                <Typography>Henüz işlem bulunmuyor.</Typography>
              ) : (
                <List dense>
                  {card.transactions.map((t) => (
                    <ListItem key={t.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <ListItemText
                        primary={
                          `${new Date(t.createdAt).toLocaleString()} • ${t.description} (${t.type})`
                        }
                        secondary={`Puan: ${t.points > 0 ? '+' : ''}${t.points} | Puan Bakiye: ${t.pointBalance}`}
                      />
                      {t.amount != null && (
                        <Typography variant="body2">Tutar: {Number(t.amount).toFixed(2)} ₺</Typography>
                      )}
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
