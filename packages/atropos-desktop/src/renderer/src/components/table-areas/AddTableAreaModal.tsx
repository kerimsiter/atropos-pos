// packages/atropos-desktop/src/renderer/src/components/table-areas/AddTableAreaModal.tsx
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Box } from '@mui/material';
import api from '../../api';

// Form validasyon şeması
const schema = yup.object().shape({
  name: yup.string().required('Alan adı zorunludur.'),
});

interface AddTableAreaModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddTableAreaModal = ({ open, onClose, onSuccess }: AddTableAreaModalProps) => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '' }
  });

  const onSubmit = async (data: { name: string }) => {
    try {
      await api.post('/table-areas', data);
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Alan eklenirken hata oluştu:", error);
      alert('Alan eklenemedi!');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Yeni Masa Alanı Ekle</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller name="name" control={control} render={({ field }) => (
            <TextField {...field} label="Alan Adı" fullWidth margin="normal" error={!!errors.name} helperText={errors.name?.message} autoFocus />
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

