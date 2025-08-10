import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Grid } from '@mui/material';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../../api';

const schema = yup.object({
  firstName: yup.string().optional(),
  lastName: yup.string().optional(),
  phone: yup.string().required('Telefon zorunludur'),
  email: yup.string().email('Geçerli bir e-posta girin').optional(),
  address: yup.string().optional(),
});

export interface AddCustomerModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customerToEdit?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    phone: string;
    email?: string | null;
    address?: string | null;
  } | null;
}

export const AddCustomerModal = ({ open, onClose, onSuccess, customerToEdit }: AddCustomerModalProps) => {
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: '',
    },
  });

  useEffect(() => {
    if (customerToEdit) {
      reset({
        firstName: customerToEdit.firstName || '',
        lastName: customerToEdit.lastName || '',
        phone: customerToEdit.phone || '',
        email: customerToEdit.email || '',
        address: customerToEdit.address || '',
      });
    } else {
      reset({ firstName: '', lastName: '', phone: '', email: '', address: '' });
    }
  }, [customerToEdit, reset]);

  const onSubmit = async (data: any) => {
    try {
      if (customerToEdit?.id) {
        await api.patch(`/customers/${customerToEdit.id}`, data);
      } else {
        await api.post('/customers', data);
      }
      onSuccess();
      onClose();
    } catch (e) {
      console.error('Müşteri kaydedilirken hata:', e);
      alert('Müşteri kaydedilemedi');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{customerToEdit ? 'Müşteri Düzenle' : 'Yeni Müşteri Ekle'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller name="firstName" control={control} render={({ field }) => (
                <TextField {...field} label="Ad" fullWidth error={!!errors.firstName} helperText={(errors.firstName as any)?.message}
                />
              )} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="lastName" control={control} render={({ field }) => (
                <TextField {...field} label="Soyad" fullWidth error={!!errors.lastName} helperText={(errors.lastName as any)?.message}
                />
              )} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="phone" control={control} render={({ field }) => (
                <TextField {...field} label="Telefon" required fullWidth error={!!errors.phone} helperText={(errors.phone as any)?.message}
                />
              )} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="email" control={control} render={({ field }) => (
                <TextField {...field} label="E-posta" fullWidth error={!!errors.email} helperText={(errors.email as any)?.message}
                />
              )} />
            </Grid>
            <Grid item xs={12}>
              <Controller name="address" control={control} render={({ field }) => (
                <TextField {...field} label="Adres" fullWidth multiline minRows={2} error={!!errors.address} helperText={(errors.address as any)?.message}
                />
              )} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>İptal</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>{customerToEdit ? 'Güncelle' : 'Kaydet'}</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
