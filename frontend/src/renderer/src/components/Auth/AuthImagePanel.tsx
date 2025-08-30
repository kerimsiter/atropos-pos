// frontend/src/renderer/src/components/Auth/AuthImagePanel.tsx
import { Box, Title, Text, Stack } from '@mantine/core';
import authImage from '../../assets/auth-image.jpg'; // Görseli import et

const overlayStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.85) 100%)',
  zIndex: 1,
};

export function AuthImagePanel() {
  return (
    <Box
      style={{
        position: 'relative',
        height: '100vh',
        backgroundImage: `url(${authImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div style={overlayStyle} />
      <Stack
        justify="flex-end"
        style={{ height: '100%', position: 'relative', zIndex: 2, padding: 'var(--mantine-spacing-xl)' }}
      >
        <Title order={1} c="white">
          Kontrol Sizde Kalsın
        </Title>
        <Text size="lg" c="dimmed">
          İşletmenizi dilediğiniz zaman, dilediğiniz yerden sorunsuz bir giriş deneyimiyle kolayca yönetin.
        </Text>
      </Stack>
    </Box>
  );
}
