import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';
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
}

export const PaymentModal = ({ open, onClose, orderId, totalAmount, onSuccess }: Props) => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [amount, setAmount] = useState(String(totalAmount.toFixed(2)));

  useEffect(() => {
    if (open) {
      setAmount(String(totalAmount.toFixed(2)));
      api.get('/payment-methods')
        .then((res) => {
          setMethods(res.data || []);
          if (res.data?.length) setPaymentMethodId(res.data[0].id);
        })
        .catch((e) => {
          console.error('Ödeme yöntemleri getirilemedi', e);
          toast.error('Ödeme yöntemleri getirilemedi');
        });
    }
  }, [open, totalAmount]);

  const handleSubmit = async () => {
    try {
      await api.post('/payments', { orderId, paymentMethodId, amount: String(amount) });
      onSuccess();
      onClose();
      toast.success('Ödeme alındı');
    } catch (e) {
      console.error('Ödeme alınamadı', e);
      toast.error('Ödeme alınamadı');
    }
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
