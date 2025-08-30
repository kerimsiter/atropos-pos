// frontend/src/renderer/src/pages/Auth/Login.tsx
import { Box, Image, Paper } from '@mantine/core';
import { AuthShowcasePanel } from '../../components/Auth/AuthShowcasePanel';
import { LoginForm } from '../../components/Auth/LoginForm';
import logo from '../../assets/logo.svg';

export function LoginPage(): React.JSX.Element {
  return (
    // YENİ: En dıştaki ana çerçeve. Arkaplan rengini ve iç boşluğu bu belirliyor.
    <Box bg="neutral.3" p="xl" style={{ minHeight: '100vh' }}>
      <Paper shadow="xl" radius="lg" style={{ display: 'flex', minHeight: 'calc(100vh - 2 * var(--mantine-spacing-xl))' }}>
        {/* Sol Sütun: Form Alanı */}
        <Box
          bg="white"
          style={{
            flex: '0 0 42%', // Genişliği ayarla (lg: 5 -> ~41.6%)
            borderTopLeftRadius: 'var(--mantine-radius-lg)',
            borderBottomLeftRadius: 'var(--mantine-radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--mantine-spacing-xl)',
          }}
        >
          <Box style={{ maxWidth: '420px', width: '100%' }}>
            <Image src={logo} h={40} w="auto" fit="contain" mb={50} />
            <LoginForm />
          </Box>
        </Box>

        {/* Sağ Sütun: Vitrin Alanı */}
        <Box
          style={{
            flex: '1',
            borderTopRightRadius: 'var(--mantine-radius-lg)',
            borderBottomRightRadius: 'var(--mantine-radius-lg)',
            overflow: 'hidden', // Görselin taşmasını engelle
            position: 'relative', // Konumlandırma için
          }}
          bg="brand.0"
        >
          <AuthShowcasePanel />
        </Box>
      </Paper>
    </Box>
  );
}
