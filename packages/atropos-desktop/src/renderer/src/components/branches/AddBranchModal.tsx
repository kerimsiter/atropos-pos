import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Box } from '@mui/material';
import api from '../../api';

// Form validasyon şeması
const schema = yup.object().shape({
  name: yup.string().required('Şube adı zorunludur.'),
  code: yup.string().required('Şube kodu zorunludur.'),
  address: yup.string().required('Adres zorunludur.'),
  phone: yup.string().required('Telefon zorunludur.'),
});

interface AddBranchModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddBranchModal = ({ open, onClose, onSuccess }: AddBranchModalProps) => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', code: '', address: '', phone: '' }
  });

  const onSubmit = async (data: yup.InferType<typeof schema>) => {
    try {
      await api.post('/branches', data);
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Şube eklenirken hata oluştu:", error);
      alert('Şube eklenemedi!');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Yeni Şube Ekle</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller name="name" control={control} render={({ field }) => (
            <TextField {...field} label="Şube Adı" fullWidth margin="normal" error={!!errors.name} helperText={errors.name?.message} autoFocus />
          )} />
          <Controller name="code" control={control} render={({ field }) => (
            <TextField {...field} label="Şube Kodu" fullWidth margin="normal" error={!!errors.code} helperText={errors.code?.message} />
          )} />
          <Controller name="address" control={control} render={({ field }) => (
            <TextField {...field} label="Adres" fullWidth margin="normal" error={!!errors.address} helperText={errors.address?.message} />
          )} />
          <Controller name="phone" control={control} render={({ field }) => (
            <TextField {...field} label="Telefon" fullWidth margin="normal" error={!!errors.phone} helperText={errors.phone?.message} />
          )} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>İptal</Button>
          <Button type="submit" variant="contained">Kaydet</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

