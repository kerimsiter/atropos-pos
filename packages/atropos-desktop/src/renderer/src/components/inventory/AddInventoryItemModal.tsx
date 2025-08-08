import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import api from '../../api';

export type InventoryItemForm = {
  name: string;
  code: string;
  unit: string;
  currentStock: number;
  criticalLevel?: number | null;
};

export function AddInventoryItemModal({ open, onClose, onSuccess, itemToEdit }: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  itemToEdit?: any | null;
}) {
  const UNIT_OPTIONS = useMemo(() => [
    'PIECE', 'KG', 'GRAM', 'LITER', 'ML', 'PORTION', 'BOX', 'PACKAGE'
  ], []);

  const [form, setForm] = useState<InventoryItemForm>({
    name: '',
    code: '',
    unit: 'PIECE',
    currentStock: 0,
    criticalLevel: null,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (itemToEdit) {
      setForm({
        name: itemToEdit.name ?? '',
        code: itemToEdit.code ?? '',
        unit: itemToEdit.unit ?? 'PIECE',
        currentStock: Number(itemToEdit.currentStock ?? 0),
        criticalLevel: itemToEdit.criticalLevel != null ? Number(itemToEdit.criticalLevel) : null,
      });
    } else {
      setForm({ name: '', code: '', unit: 'PIECE', currentStock: 0, criticalLevel: null });
    }
  }, [itemToEdit, open]);

  const handleChange = (key: keyof InventoryItemForm) => (e: any) => {
    const value = key === 'currentStock' || key === 'criticalLevel' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value;
    setForm((f) => ({ ...f, [key]: value } as any));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        code: form.code,
        unit: form.unit,
        currentStock: Number(form.currentStock || 0),
        criticalLevel: form.criticalLevel === '' ? null : form.criticalLevel,
      };
      if (itemToEdit?.id) {
        await api.patch(`/inventory-items/${itemToEdit.id}`, payload);
      } else {
        await api.post('/inventory-items', payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Inventory save error', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{itemToEdit ? 'Envanter Kalemi Düzenle' : 'Yeni Envanter Kalemi'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField label="Ad" fullWidth value={form.name} onChange={handleChange('name')} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Kod" fullWidth value={form.code} onChange={handleChange('code')} />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="unit-label">Birim</InputLabel>
              <Select labelId="unit-label" label="Birim" value={form.unit} onChange={handleChange('unit')}>
                {UNIT_OPTIONS.map((u) => (
                  <MenuItem key={u} value={u}>{u}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField type="number" label="Stok" fullWidth inputProps={{ step: '0.001' }} value={form.currentStock} onChange={handleChange('currentStock')} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField type="number" label="Kritik Seviye" fullWidth inputProps={{ step: '0.001' }} value={(form.criticalLevel as any) ?? ''} onChange={handleChange('criticalLevel')} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>İptal</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving}>{itemToEdit ? 'Güncelle' : 'Kaydet'}</Button>
      </DialogActions>
    </Dialog>
  );
}
