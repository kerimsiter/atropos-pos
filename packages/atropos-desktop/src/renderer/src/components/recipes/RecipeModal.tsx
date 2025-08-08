import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton, FormControl, InputLabel, Select, MenuItem, Typography, Box } from '@mui/material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../api';

type RecipeItemForm = {
  inventoryItemId: string;
  quantity: number | string;
};

type RecipeForm = {
  productId: string;
  name: string;
  yield?: number | string | null;
  items: RecipeItemForm[];
};

export function RecipeModal({ open, onClose, product }: { open: boolean; onClose: () => void; product: any | null; }) {
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [existingRecipeId, setExistingRecipeId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Units will be derived from selected inventory item to avoid enum mismatch

  const { control, handleSubmit, reset, watch } = useForm<RecipeForm>({
    defaultValues: {
      productId: '',
      name: '',
      yield: '',
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const selectedItemsMap = useMemo(() => {
    const map = new Map<string, any>();
    inventoryItems.forEach((it) => map.set(it.id, it));
    return map;
  }, [inventoryItems]);

  const fetchInventory = async () => {
    const res = await api.get('/inventory-items');
    setInventoryItems(res.data || []);
  };

  const fetchRecipe = async (productId: string) => {
    const res = await api.get(`/recipes/by-product/${productId}`);
    const recipe = res.data;
    if (recipe) {
      setExistingRecipeId(recipe.id);
      reset({
        productId,
        name: recipe.name ?? product?.name ?? '',
        yield: recipe.yield != null ? String(Number(recipe.yield)) : '',
        items: (recipe.items || []).map((ri: any) => ({
          inventoryItemId: ri.inventoryItemId,
          quantity: String(Number(ri.quantity)),
        })),
      });
    } else {
      setExistingRecipeId(null);
      reset({
        productId,
        name: product?.name ?? '',
        yield: '',
        items: [],
      });
    }
  };

  useEffect(() => {
    if (!open || !product?.id) return;
    setLoading(true);
    Promise.all([fetchInventory(), fetchRecipe(product.id)])
      .catch((e) => console.error('Recipe init error', e))
      .finally(() => setLoading(false));
  }, [open, product?.id]);

  const onSubmit = async (data: RecipeForm) => {
    setSaving(true);
    try {
      setFormError(null);
      // basic client-side validation for items
      const cleanedItems = (data.items || []).filter((i) => i.inventoryItemId && i.quantity !== '' && Number(i.quantity) > 0);
      if (cleanedItems.length === 0) {
        setFormError('En az bir geçerli malzeme ekleyin (ürün ve miktar zorunlu).');
        return;
      }
      const parsedYield = data.yield === '' || data.yield == null ? undefined : Number(data.yield);
      const payload = {
        productId: product!.id,
        name: data.name || product!.name,
        // omit yield if empty to satisfy @IsOptional
        ...(parsedYield !== undefined ? { yield: parsedYield } : {}),
        items: cleanedItems.map((i) => {
          const inv = selectedItemsMap.get(i.inventoryItemId);
          const unit = inv?.unit; // derive from inventory item
          if (!unit) {
            throw new Error('Seçilen bazı malzemelerde birim bulunamadı. Envanter kalemlerini kontrol edin.');
          }
          return ({
            inventoryItemId: i.inventoryItemId,
            quantity: Number(i.quantity),
            unit,
          });
        }),
      };
      if (existingRecipeId) {
        await api.patch(`/recipes/${existingRecipeId}`, payload);
      } else {
        await api.post('/recipes', payload);
      }
      onClose();
    } catch (e) {
      console.error('Recipe save error', e);
      setFormError(e instanceof Error ? e.message : 'Reçete kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddItem = () => {
    append({ inventoryItemId: '', quantity: '' });
  };

  const itemsWatch = watch('items');

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Reçete: {product?.name}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 1 }}>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <TextField label="Reçete Adı" fullWidth {...field} value={field.value ?? ''} />
            )}
          />
          <Controller
            control={control}
            name="yield"
            render={({ field }) => (
              <TextField
                type="number"
                inputProps={{ step: '0.001' }}
                label="Verim (Porsiyon)"
                fullWidth
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
        </Box>

        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Malzemeler</Typography>
          <Button startIcon={<AddCircleOutlineIcon />} onClick={handleAddItem}>
            Malzeme Ekle
          </Button>
        </Box>

        {formError && (
          <Typography color="error" sx={{ mt: 1 }}>
            {formError}
          </Typography>
        )}

        {fields.map((field, index) => (
          <Box key={field.id} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.5fr 0.8fr 0.7fr auto' }, gap: 2, alignItems: 'center', mt: 2 }}>
            <Controller
              control={control}
              name={`items.${index}.inventoryItemId` as const}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id={`inv-${index}`}>Envanter Kalemi</InputLabel>
                  <Select labelId={`inv-${index}`} label="Envanter Kalemi" {...field}
                    onChange={(e) => {
                      const val = e.target.value as string;
                      field.onChange(val);
                    }}
                  >
                    {inventoryItems.map((it) => (
                      <MenuItem key={it.id} value={it.id}>{it.name} ({it.unit})</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name={`items.${index}.quantity` as const}
              render={({ field }) => (
                <TextField
                  type="number"
                  inputProps={{ step: '0.001' }}
                  label="Miktar"
                  fullWidth
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            <TextField
              label="Birim"
              fullWidth
              value={selectedItemsMap.get(itemsWatch?.[index]?.inventoryItemId)?.unit || ''}
              InputProps={{ readOnly: true }}
            />
            <IconButton color="error" onClick={() => remove(index)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>İptal</Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained" disabled={saving || loading}>Reçeteyi Kaydet</Button>
      </DialogActions>
    </Dialog>
  );
}
