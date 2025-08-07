// packages/atropos-desktop/src/renderer/src/pages/DashboardPage.tsx
import { useAuthStore } from '../store/authStore';
import { Box, Button, Typography } from '@mui/material';

export default function DashboardPage() {
  const logout = useAuthStore((state) => state.logout);
  return (
    <Box sx={{p: 4}}>
      <Typography variant="h4">Ana Panel</Typography>
      <Typography>Başarıyla giriş yaptınız!</Typography>
      <Button variant="contained" color="secondary" onClick={logout} sx={{mt: 2}}>Çıkış Yap</Button>
    </Box>
  );
}

