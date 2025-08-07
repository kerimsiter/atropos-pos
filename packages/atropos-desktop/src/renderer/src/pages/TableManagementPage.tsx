// packages/atropos-desktop/src/renderer/src/pages/TableManagementPage.tsx
import { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton, Paper, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import api from '../api';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { AddTableAreaModal } from '../components/table-areas/AddTableAreaModal';

interface TableArea {
    id: string;
    name: string;
}

export default function TableManagementPage() {
  const [areas, setAreas] = useState<TableArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAreas = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/table-areas');
      setAreas(data);
    } catch (error) { 
        console.error("Alanlar yüklenirken bir hata oluştu:", error);
        alert("Alanlar yüklenemedi.")
    } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAreas(); }, []);
  
  const handleDelete = async (id: string) => {
    if (window.confirm("Bu alanı silmek, içindeki tüm masaları da silecektir. Emin misiniz?")) {
      try {
        await api.delete(`/table-areas/${id}`);
        fetchAreas();
      } catch (error) { 
        console.error("Alan silinirken bir hata oluştu:", error);
        alert("Alan silinemedi."); 
      }
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Masa Yönetimi</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsModalOpen(true)}>
          Yeni Alan Ekle
        </Button>
      </Box>
      <Paper>
        {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        ) : (
        <List>
          {areas.map((area) => (
            <ListItem
              key={area.id}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(area.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={area.name} />
            </ListItem>
          ))}
        </List>
        )}
      </Paper>
      <AddTableAreaModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchAreas} />
    </>
  );
}
