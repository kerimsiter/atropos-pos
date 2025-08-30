// frontend/src/renderer/src/components/Auth/AuthShowcasePanel.tsx
import { useState, useEffect } from 'react';
import { Box, Stack, Title, Text, Image, Flex } from '@mantine/core';
import showcaseImage from '../../assets/product-showcase.png';

const showcaseTexts = [
  {
    title: 'Tekrar Hoş Geldiniz!',
    subtitle: 'Kaldığınız yerden devam etmek, tüm araçlarınıza erişmek ve işinizi büyütmek için giriş yapın.',
  },
  {
    title: 'Stok Yönetimi Hiç Bu Kadar Kolay Olmadı',
    subtitle: 'Anlık stok takibi, tedarikçi yönetimi ve kritik seviye uyarıları ile daima bir adım önde olun.',
  },
  {
    title: 'Raporlar Parmaklarınızın Ucunda',
    subtitle: 'Günlük, haftalık ve aylık satış raporları ile işletmenizin performansını anlık olarak izleyin.',
  },
];

export function AuthShowcasePanel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % showcaseTexts.length);
    }, 5000); // Her 5 saniyede bir yazıyı değiştir

    return () => clearInterval(interval);
  }, []);

  return (
    <Flex direction="column" justify="center" align="center" style={{ height: '100%', padding: 'var(--mantine-spacing-xl)', position: 'relative', overflow: 'hidden' }}>

      {/* Metin ve Indicator Alanı */}
      <Stack align="center" gap="xl" style={{ maxWidth: '500px', zIndex: 1 }}>
        <Box ta="center" style={{ width: '100%', height: '150px' }}> {/* YENİ: Sabit yükseklik */}
          <Title order={2} fz={40} lh="48px" fw={500} mb="lg">
            {showcaseTexts[currentIndex].title}
          </Title>
          <Text size="lg" c="neutral.6" lh="24px">
            {showcaseTexts[currentIndex].subtitle}
          </Text>
        </Box>

        <Flex gap="sm" justify="center">
          {showcaseTexts.map((_, index) => (
            <Box
              key={index}
              style={{
                width: index === currentIndex ? '24px' : '6px',
                height: '6px',
                borderRadius: '3px',
                backgroundColor: index === currentIndex ? 'var(--mantine-color-brand-5)' : 'var(--mantine-color-neutral-4)',
                transition: 'width 0.3s ease',
              }}
            />
          ))}
        </Flex>
      </Stack>

      {/* YENİ: Konumlandırılmış Büyük Ürün Görseli */}
      <Image
        src={showcaseImage}
        radius="xl"
        style={{
          position: 'absolute',
          bottom: '-5%', // Alt kenardan hafifçe taşsın
          right: '-10%', // Sağ kenardan daha fazla taşsın
          width: '90%', // Genişliği ayarla
          maxWidth: '700px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '4px solid white',
          zIndex: 0, // Metinlerin arkasında kalsın
        }}
      />
    </Flex>
  );
}
