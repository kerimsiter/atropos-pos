// frontend/src/renderer/src/pages/Auth/Login.tsx
import { Grid, Stack, Title, Text, Box, Flex, Image } from '@mantine/core';
import { AuthShowcasePanel } from '../../components/Auth/AuthShowcasePanel';
import { LoginForm } from '../../components/Auth/LoginForm';
import logo from '../../assets/logo.svg';

export function LoginPage(): React.JSX.Element {
  return (
    // Ana Grid, en dıştaki arkaplanı belirler
    <Grid gutter={0} bg="neutral.2">
      {/* Sol Sütun: Form Alanı */}
      <Grid.Col
        span={{ base: 12, md: 6, lg: 5 }} // Geniş ekranlarda daha dar
        bg="white" // Sol panelin arkaplanı beyaz
      >
        {/* İçeriği dikeyde ortalamak için Flex container */}
        <Flex
          direction="column"
          justify="center"
          style={{ height: '100vh', padding: '24px' }}
        >
          {/* Formu ve başlıkları saran, yuvarlatılmış kutu */}
          <Box
            style={{
              maxWidth: '427px', // Yeni Figma tasarımındaki genişlik
              width: '100%',
              margin: '0 auto',
              padding: '20px',
              borderRadius: '24px', // Yuvarlatılmış köşeler
              backgroundColor: 'white',
            }}
          >
            {/* Logo ve başlık bölümü */}
            <Stack align="center" gap="md" mb="lg">
              <Image src={logo} h={48} w="auto" fit="contain" />
              <Stack gap={4} align="center">
                <Title order={2} size="32px" style={{ lineHeight: '40px', fontWeight: 500 }}>
                  Giriş Yap
                </Title>
                <Text c="neutral.6" size="16px" style={{ lineHeight: '24px' }}>
                  İşletmenizi yönetmeye devam edin.
                </Text>
              </Stack>
            </Stack>

            {/* Form Bileşeni */}
            <LoginForm />
          </Box>
        </Flex>
      </Grid.Col>

      {/* Sağ Sütun: Vitrin Alanı - Yeni Figma Tasarımına Göre */}
      <Grid.Col
        span={{ base: 0, md: 6, lg: 7 }} // Geniş ekranlarda daha geniş
        visibleFrom="md"
        bg="#e8f2f2" // Yeni Figma tasarımındaki açık yeşil ton
      >
        <AuthShowcasePanel />
      </Grid.Col>
    </Grid>
  );
}
