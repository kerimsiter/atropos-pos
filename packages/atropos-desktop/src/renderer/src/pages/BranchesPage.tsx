import { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import api from '../api';
import { AddBranchModal } from '../components/branches/AddBranchModal';
import { useAuthStore } from '../store/authStore'; // EKLENDİ

interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
}

const BranchesPage = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const adminUserId = useAuthStore((state) => (state as any).profile?.userId); // profile tipinde userId yoksa güvenli erişim

  const fetchBranches = async () => {
    try {
      const response = await api.get('/branches');
      setBranches(response.data);
    } catch (error) {
      console.error('Şubeler getirilirken hata oluştu:', error);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu şubeyi silmek istediğinizden emin misiniz?')) {
      try {
        await api.delete(`/branches/${id}`);
        fetchBranches();
      } catch (error) {
        console.error('Şube silinirken hata oluştu:', error);
        alert('Şube silinemedi!');
      }
    }
  };

  // YENİ FONKSİYON
  const handleAssignAdmin = async (branchId: string) => {
    if (!adminUserId) {
      alert('Yönetici kullanıcı ID bulunamadı!');
      return;
    }
    if (window.confirm(`Yöneticiyi bu şubeye atamak istediğinizden emin misiniz?`)) {
      try {
        await api.patch(`/users/${adminUserId}/assign-branch`, { branchId });
        alert(
          'Yönetici başarıyla şubeye atandı. Değişikliklerin etkili olması için lütfen uygulamadan çıkış yapıp tekrar giriş yapın.'
        );
      } catch (error) {
        console.error('Yönetici atanırken hata:', error);
        alert('Yönetici atanamadı!');
      }
    }
  };


  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Şube Adı', flex: 1 },
    { field: 'code', headerName: 'Kod', width: 120 },
    { field: 'address', headerName: 'Adres', flex: 2 },
    { field: 'phone', headerName: 'Telefon', width: 150 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'İşlemler',
      width: 150, // Genişletildi
      getActions: (params) => [
        <GridActionsCellItem
          icon={<AssignmentTurnedInIcon />}
          label="Admin'i Ata"
          onClick={() => handleAssignAdmin(params.id as string)}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Sil"
          onClick={() => handleDelete(params.id as string)}
          showInMenu
        />,
      ],
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Şube Yönetimi
        </Typography>
        <Button variant="contained" onClick={() => setIsModalOpen(true)}>
          Yeni Şube Ekle
        </Button>
      </Box>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={branches}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
        />
      </Box>
      
      <AddBranchModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchBranches();
          setIsModalOpen(false);
        }}
      />
    </Box>
  );
};

export default BranchesPage;
