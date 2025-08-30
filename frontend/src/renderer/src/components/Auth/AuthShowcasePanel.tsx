// frontend/src/renderer/src/components/Auth/AuthShowcasePanel.tsx
import { useState, useEffect } from 'react';
import { Box, Stack, Title, Text, Image, Center, Flex } from '@mantine/core';
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
    <Center style={{ height: '100%', padding: 'var(--mantine-spacing-xl)' }}>
      <Stack align="center" gap="xl" style={{ maxWidth: '500px' }}>
        {/* Ana başlık ve açıklama */}
        <Box ta="center" style={{ width: '100%' }}>
          <Title
            order={2}
            size="40px"
            style={{
              lineHeight: '48px',
              fontWeight: 500,
              marginBottom: '20px'
            }}
          >
            {showcaseTexts[currentIndex].title}
          </Title>
          <Text
            size="16px"
            style={{
              lineHeight: '24px',
              opacity: 0.7,
              maxWidth: '500px'
            }}
          >
            {showcaseTexts[currentIndex].subtitle}
          </Text>
        </Box>

        {/* Indicator noktaları */}
        <Flex gap="8px" justify="center">
          {showcaseTexts.map((_, index) => (
            <Box
              key={index}
              style={{
                width: index === currentIndex ? '24px' : '6px',
                height: '6px',
                borderRadius: index === currentIndex ? '3px' : '50%',
                backgroundColor: index === currentIndex ? '#16a34a' : '#dadddc',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </Flex>

        {/* Büyük ürün görseli */}
        <Box style={{ position: 'relative', width: '100%' }}>
          <Image
            src={showcaseImage}
            radius="16px"
            style={{
              width: '100%',
              maxWidth: '600px',
              boxShadow: '0 16px 32px -12px rgba(14, 18, 27, 0.1)',
              border: '4px solid white',
              borderRadius: '20px',
            }}
          />
        </Box>
      </Stack>
    </Center>
  );
}
