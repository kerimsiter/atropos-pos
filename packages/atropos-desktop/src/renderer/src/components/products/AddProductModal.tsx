// packages/atropos-desktop/src/renderer/src/components/products/AddProductModal.tsx
// Önceki kodun güncellenmiş ve düzenlemeyi destekleyen hali
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Box, FormControl, InputLabel, Select, MenuItem, FormHelperText, CircularProgress } from '@mui/material';
import api from '../../api';

const schema = yup.object().shape({
  name: yup.string().required('Ürün adı zorunludur.'),
  code: yup.string().required('SKU kodu zorunludur.'),
  basePrice: yup.number().typeError('Fiyat sayı olmalıdır.').positive('Fiyat pozitif olmalıdır.').required('Fiyat zorunludur.'),
  categoryId: yup.string().required('Lütfen bir kategori seçin.'),
  taxId: yup.string().required('Lütfen bir vergi oranı seçin.'),
});

// productToEdit prop'u eklendi
export const AddProductModal = ({ open, onClose, onSuccess, productToEdit }) => {
  const [categories, setCategories] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', code: '', basePrice: 0, categoryId: '', taxId: '' }
  });

  useEffect(() => {
    if (open) {
      setLoading(true);
      // Kategori ve Vergi listelerini çek
      const fetchDropdownData = async () => {
        try {
          const [categoriesRes, taxesRes] = await Promise.all([
            api.get('/categories'),
            api.get('/taxes')
          ]);
          setCategories(categoriesRes.data);
          setTaxes(taxesRes.data);
        } catch (error) {
          console.error("Kategori veya Vergi verileri çekilirken hata:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDropdownData();

      // EĞER DÜZENLEME MODUNDA İSE, FORMU DOLDUR
      if (productToEdit) {
        reset({
          name: productToEdit.name,
          code: productToEdit.code,
          basePrice: productToEdit.basePrice,
          categoryId: productToEdit.categoryId,
          taxId: productToEdit.taxId,
        });
      } else {
        // EKLEME MODUNDA İSE FORMU TEMİZLE
        reset({ name: '', code: '', basePrice: 0, categoryId: '', taxId: '' });
      }
    }
  }, [open, productToEdit, reset]);

  const onSubmit = async (data) => {
    const payload = { ...data, basePrice: Number(data.basePrice) };
    try {
      if (productToEdit) {
        // DÜZENLEME: PATCH isteği at
        await api.patch(`/products/${productToEdit.id}`, payload);
      } else {
        // EKLEME: POST isteği at
        await api.post('/products', payload);
      }
      onSuccess();
      handleClose();
    } catch (error) {
      alert('İşlem başarısız oldu!');
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      {/* Dialog başlığı artık dinamik */}
      <DialogTitle>{productToEdit ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
            {loading ? <CircularProgress /> : (
            <>
                <Controller name="name" control={control} render={({ field }) => (
                <TextField {...field} label="Ürün Adı" fullWidth margin="normal" error={!!errors.name} helperText={errors.name?.message} autoFocus />
                )} />
                <Controller name="code" control={control} render={({ field }) => (
                <TextField {...field} label="SKU Kodu" fullWidth margin="normal" error={!!errors.code} helperText={errors.code?.message} />
                )} />
                <Controller name="basePrice" control={control} render={({ field }) => (
                <TextField {...field} label="Fiyat" type="number" fullWidth margin="normal" error={!!errors.basePrice} helperText={errors.basePrice?.message} />
                )} />

                {/* Kategori Seçim Kutusu */}
                <FormControl fullWidth margin="normal" error={!!errors.categoryId}>
                <InputLabel id="category-select-label">Kategori</InputLabel>
                <Controller name="categoryId" control={control} render={({ field }) => (
                    <Select {...field} labelId="category-select-label" label="Kategori">
                    {categories.map((cat: any) => (
                        <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                    ))}
                    </Select>
                )} />
                <FormHelperText>{errors.categoryId?.message}</FormHelperText>
                </FormControl>

                {/* Vergi Seçim Kutusu */}
                <FormControl fullWidth margin="normal" error={!!errors.taxId}>
                <InputLabel id="tax-select-label">Vergi</InputLabel>
                <Controller name="taxId" control={control} render={({ field }) => (
                    <Select {...field} labelId="tax-select-label" label="Vergi">
                    {taxes.map((tax: any) => (
                        <MenuItem key={tax.id} value={tax.id}>{tax.name} (%{tax.rate})</MenuItem>
                    ))}
                    </Select>
                )} />
                <FormHelperText>{errors.taxId?.message}</FormHelperText>
                </FormControl>
            </>
            )}
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>İptal</Button>
            <Button type="submit" variant="contained" disabled={loading}>Kaydet</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
