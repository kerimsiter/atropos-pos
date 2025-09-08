// frontend/src/renderer/src/components/Auth/AuthHeader.tsx
import { Box, Button, Group, Image } from '@mantine/core';
import { IconHelpCircle } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import logo from '../../assets/logo.svg';

export function AuthHeader() {
  const isMobile = useMediaQuery('(max-width: 480px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isSmallMobile = useMediaQuery('(max-width: 360px)');

  return (
    // Sayfanın üst kısmına sabitlenen ana kutu
    <Box
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: isSmallMobile ? '12px' : isTablet ? '16px' : '20px 24px',
        zIndex: 10,
      }}
    >
      <Group justify="space-between" align="center">
        {/* SVG Logo - responsive boyut */}
        <Image 
          src={logo} 
          h={isSmallMobile ? 20 : isTablet ? 24 : 28}
          w="auto" 
          fit="contain"
          style={{
            filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
          }}
        />

        {/* Destek Butonu - responsive */}
        <Button
          variant="subtle"
          size={isSmallMobile ? 'xs' : isTablet ? 'xs' : 'sm'}
          color="gray"
          leftSection={<IconHelpCircle size={isSmallMobile ? 12 : isTablet ? 14 : 16} />}
          style={{
            fontWeight: 500,
            fontSize: isSmallMobile ? '11px' : isTablet ? '12px' : '14px',
            height: isSmallMobile ? '28px' : isTablet ? '32px' : '36px',
            borderRadius: isSmallMobile ? '4px' : isTablet ? '6px' : '8px',
            transition: 'all 0.2s ease',
            minWidth: isSmallMobile ? '60px' : 'auto',
          }}
          styles={{
            root: {
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                transform: 'translateY(-1px)',
              },
            },
          }}
        >
          {isSmallMobile ? 'Yardım' : isMobile ? 'Destek' : 'Destek İste'}
        </Button>
      </Group>
    </Box>
  );
}
