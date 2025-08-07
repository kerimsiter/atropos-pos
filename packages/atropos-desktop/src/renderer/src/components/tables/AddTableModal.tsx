import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import api from '../../api';
import { TableArea } from '../../types/TableArea'; // Varsayımsal tip

const schema = yup.object().shape({
  number: yup.string().required('Masa numarası zorunludur.'),
  capacity: yup.number().required('Kapasite zorunludur.').positive('Kapasite pozitif bir sayı olmalıdır.').integer(),
  areaId: yup.string().required('Alan seçimi zorunludur.'),
});

interface AddTableModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tableAreas: TableArea[];
}

export const AddTableModal = ({ open, onClose, onSuccess, tableAreas }: AddTableModalProps) => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { number: '', capacity: 4, areaId: '' }
  });

  const onSubmit = async (data: yup.InferType<typeof schema>) => {
    try {
      await api.post('/tables', data);
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Masa eklenirken hata oluştu:", error);
      alert('Masa eklenemedi!');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Yeni Masa Ekle</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller name="number" control={control} render={({ field }) => (
            <TextField {...field} label="Masa Numarası" fullWidth margin="normal" error={!!errors.number} helperText={errors.number?.message} autoFocus />
          )} />
          <Controller name="capacity" control={control} render={({ field }) => (
            <TextField {...field} label="Kapasite" type="number" fullWidth margin="normal" error={!!errors.capacity} helperText={errors.capacity?.message} />
          )} />
          <FormControl fullWidth margin="normal" error={!!errors.areaId}>
            <InputLabel id="area-select-label">Alan</InputLabel>
            <Controller
              name="areaId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="area-select-label"
                  label="Alan"
                >
                  {tableAreas.map((area) => (
                    <MenuItem key={area.id} value={area.id}>
                      {area.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.areaId && <p style={{ color: '#d32f2f', fontSize: '0.75rem', margin: '3px 14px 0' }}>{errors.areaId.message}</p>}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>İptal</Button>
          <Button type="submit" variant="contained">Kaydet</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

