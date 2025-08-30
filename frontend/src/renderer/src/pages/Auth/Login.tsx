// frontend/src/renderer/src/pages/Auth/Login.tsx
import { Grid, Stack, Title, Text, Image, Box, Flex } from '@mantine/core';
import { AuthImagePanel } from '../../components/Auth/AuthImagePanel';
import { LoginForm } from '../../components/Auth/LoginForm';
import logo from '../../assets/logo.svg';

export function LoginPage(): React.JSX.Element {
  return (
    <Grid gutter={0} style={{ backgroundColor: '#FFFFFF' }}>
      {/* Sol Sütun: Form */}
      <Grid.Col span={{ base: 12, md: 6 }}>
        {/* İçeriği dikeyde ortalamak için Flex container */}
        <Flex
          direction="column"
          justify="center"
          style={{ height: '100vh', padding: 'var(--mantine-spacing-xl)' }}
        >
          {/* Formu ve başlıkları saran, genişliği sınırlı kutu */}
          <Box
            style={{
              maxWidth: '400px', // Referans tasarımdaki gibi genişliği sınırlıyoruz
              width: '100%',
              margin: '0 auto', // Yatayda ortalamak için
            }}
          >
            {/* Logo */}
            <Image src={logo} h={32} w="auto" fit="contain" mb="xl" />

            {/* Başlık */}
            <Stack gap="xs" mb={40}> {/* Başlık ve form arasına daha fazla boşluk */}
              <Title order={2}>Giriş Yap</Title>
              <Text c="dimmed">Devam etmek için hesabınıza erişin</Text>
            </Stack>

            {/* Form Bileşeni */}
            <LoginForm />
          </Box>
        </Flex>
      </Grid.Col>

      {/* Sağ Sütun: Görsel */}
      <Grid.Col span={{ base: 0, md: 6 }} visibleFrom="md">
        <AuthImagePanel />
      </Grid.Col>
    </Grid>
  );
}
