// frontend/src/renderer/src/pages/Auth/Login.tsx
import { Grid, Box, Flex } from '@mantine/core';
import { AuthShowcasePanel } from '../../components/Auth/AuthShowcasePanel';
import { LoginForm } from '../../components/Auth/LoginForm';
// YENİ: AuthHeader import edildi
import { AuthHeader } from '../../components/Auth/AuthHeader';

export function LoginPage(): React.JSX.Element {
  return (
    // Ana Grid, en dıştaki arkaplanı belirler
    <Grid gutter={0} bg="neutral.2">
      {/* Sol Sütun: Form Alanı */}
      <Grid.Col
        span={{ base: 12, md: 6, lg: 5 }}
        bg="white"
        // YENİ: Header'ın doğru konumlanması için bu gerekli
        style={{ position: 'relative' }}
      >
        {/* YENİ: Header bileşeni eklendi */}
        <AuthHeader />

        {/* İçeriği dikeyde ortalamak için Flex container (DEĞİŞİKLİK YOK) */}
        <Flex
          direction="column"
          justify="center"
          style={{ height: '100vh', padding: '24px' }}
        >
          {/* Formu ve başlıkları saran kutu (DEĞİŞİKLİK YOK) */}
          <Box
            style={{
              maxWidth: '427px',
              width: '100%',
              margin: '0 auto',
            }}
          >
            {/* Logo ve başlık artık LoginForm'un içinde değil, formun kendisinde yer alıyor */}
            {/* Bu kısım LoginForm'dan buraya taşınabilir veya LoginForm'da kalabilir.
                Mevcut haliyle de çalışır. Temizlik için LoginForm'daki başlığı kaldırabiliriz. */}
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
