// packages/atropos-desktop/src/renderer/src/pages/LoginPage.tsx
import { useAuthStore } from '../store/authStore';
import { Box, Button, TextField, Typography, Container } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Adım: useNavigate import ediliyor

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate(); // 2. Adım: useNavigate hook'u kullanılıyor
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login({ username, password });
      navigate('/dashboard'); // 3. Adım: Başarılı giriş sonrası YÖNLENDİRME
    } catch (err) {
      setError('Kullanıcı adı veya parola hatalı.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Atropos POS - Giriş</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth id="username" label="Kullanıcı Adı" name="username" autoComplete="username" autoFocus value={username} onChange={(e) => setUsername(e.target.value)} />
          <TextField margin="normal" required fullWidth name="password" label="Parola" type="password" id="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Giriş Yap</Button>
        </Box>
      </Box>
    </Container>
  );
}

