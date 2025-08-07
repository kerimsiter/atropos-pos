// packages/atropos-desktop/src/renderer/src/components/taxes/AddTaxModal.tsx
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Box } from '@mui/material';
import api from '../../api';

const schema = yup.object().shape({
  name: yup.string().required('Vergi adı zorunludur.'),
  code: yup.string().required('Vergi kodu zorunludur.'),
  rate: yup.number().typeError('Oran sayı olmalıdır.').min(0, 'Oran negatif olamaz.').required('Vergi oranı zorunludur.'),
});

    export const AddTaxModal = ({ open, onClose, onSuccess }) => {
      const { control, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
          name: '',
          code: '',
          rate: 0,
        },
      });

  const onSubmit = async (data) => {
    try {
      await api.post('/taxes', { ...data, rate: Number(data.rate) });
      reset(); onSuccess(); onClose();
    } catch (error) {
      alert('Vergi eklenemedi!');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Yeni Vergi Ekle</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller name="name" control={control} render={({ field }) => ( <TextField {...field} label="Vergi Adı (örn: KDV %20)" autoFocus fullWidth margin="normal" error={!!errors.name} helperText={errors.name?.message} /> )} />
          <Controller name="code" control={control} render={({ field }) => ( <TextField {...field} label="Vergi Kodu (örn: VAT20)" fullWidth margin="normal" error={!!errors.code} helperText={errors.code?.message} /> )} />
          <Controller name="rate" control={control} render={({ field }) => ( <TextField {...field} label="Vergi Oranı (%)" type="number" fullWidth margin="normal" error={!!errors.rate} helperText={errors.rate?.message} /> )} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>İptal</Button>
          <Button type="submit" variant="contained">Kaydet</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

