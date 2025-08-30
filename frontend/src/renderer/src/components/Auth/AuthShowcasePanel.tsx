// frontend/src/renderer/src/components/Auth/AuthShowcasePanel.tsx
import { useState, useEffect } from 'react';
import { Box, Stack, Title, Text, Image, Flex } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
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
    title: 'Raporlar Parmağınızın Ucunda',
    subtitle: 'Günlük, haftalık ve aylık satış raporları ile işletmenizin performansını anlık olarak izleyin.',
  },
];

export function AuthShowcasePanel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1200px)');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % showcaseTexts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    // Ana konteyner. `justify` ve `align` ile içeriği dikey/yatayda ortalayacak.
    <Flex
      direction="column"
      justify="center"
      align="center"
      style={{
        height: '100%',
        padding: isTablet ? 'var(--mantine-spacing-md)' : 'var(--mantine-spacing-xl)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Metin ve İndikatörleri içeren üst kısım - resmin üstünde konumlandırıldı */}
      <Stack
        align="center"
        gap={isTablet ? 'md' : 'xl'}
        style={{
          position: 'absolute',
          top: '12%',
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: isDesktop ? '600px' : '500px',
          width: '100%',
          zIndex: 2,
        }}
      >
        <Box ta="center" style={{ width: '100%', textAlign: 'center' }}>
          <Title
            order={2}
            size={isTablet ? '32px' : '40px'}
            style={{
              lineHeight: isTablet ? '40px' : '48px',
              fontWeight: 500,
              marginBottom: isTablet ? '16px' : '20px',
              textAlign: 'center',
            }}
          >
            {showcaseTexts[currentIndex].title}
          </Title>
          <Text
            size={isTablet ? '14px' : '16px'}
            style={{
              lineHeight: isTablet ? '20px' : '24px',
              opacity: 0.7,
              maxWidth: isTablet ? '400px' : '500px',
              textAlign: 'center',
              margin: '0 auto',
            }}
          >
            {showcaseTexts[currentIndex].subtitle}
          </Text>
        </Box>

        <Flex gap="8px" justify="center">
          {showcaseTexts.map((_, index) => (
            <Box
              key={index}
              style={{
                width: index === currentIndex ? (isTablet ? '20px' : '24px') : '6px',
                height: '6px',
                borderRadius: index === currentIndex ? '3px' : '50%',
                backgroundColor: index === currentIndex ? '#16a34a' : '#dadddc',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </Flex>
      </Stack>

      {/* Yeniden konumlandırılmış ürün görseli. Artık metin bloğunun bir parçası değil. */}
      <Image
        src={showcaseImage}
        radius={isTablet ? '12px' : '16px'}
        style={{
          position: 'absolute',
          // YENİ: Konumlandırma değerleri daha hassas ayarlandı
          bottom: isTablet ? '-5%' : '-8%',
          right: isTablet ? '-3%' : '-5%', // Biraz daha sola kaydırıldı
          width: isTablet ? '100%' : '105%', // Genişliği biraz azalttık
          maxWidth: '800px',
          boxShadow: isTablet
            ? '0 8px 16px -6px rgba(14, 18, 27, 0.1)'
            : '0 16px 32px -12px rgba(14, 18, 27, 0.1)',
          border: isTablet ? '3px solid white' : '4px solid white',
          borderRadius: isTablet ? '16px' : '20px',
          zIndex: 1,
        }}
      />
    </Flex>
  );
}