import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Typography, Stack } from '@mui/material';
import api from '../../api';
import { toast } from 'react-hot-toast';

interface PaymentMethod {
  id: string;
  name: string;
  code: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  orderId: string;
  totalAmount: number;
  onSuccess: () => void;
  customerId?: string | null;
}

export const PaymentModal = ({ open, onClose, orderId, totalAmount, onSuccess, customerId }: Props) => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [amount, setAmount] = useState(String(totalAmount.toFixed(2)));
  const [availablePoints, setAvailablePoints] = useState<number>(0);
  const [pointsToSpend, setPointsToSpend] = useState<string>('');
  const POINTS_PER_TL = 10; // 10 puan = 1 TL
  const discountMoney = useMemo(() => {
    const pts = Math.max(0, Math.floor(Number(pointsToSpend || '0')));
    return Math.floor((pts / POINTS_PER_TL) * 100) / 100;
  }, [pointsToSpend]);

  useEffect(() => {
    if (open) {
      setAmount(String(totalAmount.toFixed(2)));
      setPointsToSpend('');
      setAvailablePoints(0);
      api.get('/payment-methods')
        .then((res) => {
          setMethods(res.data || []);
          if (res.data?.length) setPaymentMethodId(res.data[0].id);
        })
        .catch((e) => {
          console.error('Ödeme yöntemleri getirilemedi', e);
          toast.error('Ödeme yöntemleri getirilemedi');
        });
      // fetch loyalty card for customer
      if (customerId) {
        api.get(`/customers/${customerId}/loyalty`).then((res) => {
          const pts = Number(res.data?.points ?? 0);
          setAvailablePoints(Number.isFinite(pts) ? pts : 0);
        }).catch(() => {
          setAvailablePoints(0);
        });
      }
    }
  }, [open, totalAmount, customerId]);

  const handleSubmit = async () => {
    try {
      const payload: any = { orderId, paymentMethodId, amount: String(amount) };
      const pts = Math.floor(Number(pointsToSpend || '0'));
      if (pts > 0) payload.pointsToSpend = String(pts);
      await api.post('/payments', payload);
      onSuccess();
      onClose();
      toast.success('Ödeme alındı');
    } catch (e) {
      console.error('Ödeme alınamadı', e);
      toast.error('Ödeme alınamadı');
    }
  };

  const applyPoints = () => {
    const pts = Math.floor(Number(pointsToSpend || '0'));
    if (!pts || pts <= 0) return;
    if (pts > availablePoints) {
      toast.error('Yetersiz puan');
      return;
    }
    const newAmount = Math.max(0, Number(totalAmount.toFixed(2)) - discountMoney);
    setAmount(newAmount.toFixed(2));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Ödeme Al</DialogTitle>
      <DialogContent>
        <TextField
          select
          fullWidth
          label="Ödeme Yöntemi"
          margin="normal"
          value={paymentMethodId}
          onChange={(e) => setPaymentMethodId(e.target.value)}
        >
          {methods.map((m) => (
            <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
          ))}
        </TextField>
        {customerId && (
          <Stack spacing={1} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Kullanılabilir Puan: <b>{availablePoints}</b> (10 puan = 1 TL)
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                label="Kullanılacak Puan"
                size="small"
                value={pointsToSpend}
                onChange={(e) => setPointsToSpend(e.target.value)}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              />
              <Button variant="outlined" onClick={applyPoints} disabled={!pointsToSpend}>Uygula</Button>
              <Typography variant="caption" color="text.secondary">İndirim: {discountMoney.toFixed(2)} TL</Typography>
            </Stack>
          </Stack>
        )}
        <TextField
          fullWidth
          label="Tutar"
          margin="normal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>İptal</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!paymentMethodId}>Ödeme Al</Button>
      </DialogActions>
    </Dialog>
  );
};
