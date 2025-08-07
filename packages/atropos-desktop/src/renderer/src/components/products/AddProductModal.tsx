// packages/atropos-desktop/src/renderer/src/components/products/AddProductModal.tsx
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Box, Typography } from '@mui/material';
import api from '../../api';

// Form validasyon şeması
const schema = yup.object().shape({
  name: yup.string().required('Ürün adı zorunludur.'),
  code: yup.string().required('SKU kodu zorunludur.'),
  basePrice: yup.number().typeError('Fiyat sayı olmalıdır.').positive('Fiyat pozitif olmalıdır.').required('Fiyat zorunludur.'),
  categoryId: yup.string().required('Kategori ID zorunludur.'),
  taxId: yup.string().required('Vergi ID zorunludur.'),
});

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddProductModal = ({ open, onClose, onSuccess }: AddProductModalProps) => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', code: '', basePrice: 0, categoryId: 'clxzc220y000208l9dp892h2z', taxId: 'clxzc4c7j000408l95y3pbf37' }
  });

  const onSubmit = async (data: any) => {
    try {
      await api.post('/products', {
        ...data,
        basePrice: Number(data.basePrice) // Gelen değeri sayıya çevir
      });
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Ürün eklenirken hata oluştu:", error);
      alert('Ürün eklenemedi!');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Yeni Ürün Ekle</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller name="name" control={control} render={({ field }) => (
            <TextField {...field} label="Ürün Adı" fullWidth margin="normal" error={!!errors.name} helperText={errors.name?.message} />
          )} />
          <Controller name="code" control={control} render={({ field }) => (
            <TextField {...field} label="SKU Kodu" fullWidth margin="normal" error={!!errors.code} helperText={errors.code?.message} />
          )} />
          <Controller name="basePrice" control={control} render={({ field }) => (
            <TextField {...field} label="Fiyat" type="number" fullWidth margin="normal" error={!!errors.basePrice} helperText={errors.basePrice?.message} />
          )} />
          <Typography variant="caption" color="textSecondary">
            Not: Kategori ve Vergi ID'leri ileride seçim kutusu olacaktır. Şimdilik varsayılan değerler kullanılmaktadır.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>İptal</Button>
          <Button type="submit" variant="contained">Kaydet</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

