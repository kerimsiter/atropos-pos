// frontend/src/renderer/src/components/Auth/AuthHeader.tsx
import { Box, Button, Group, Image, rem } from '@mantine/core';
import { IconHelpCircle } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import logo from '../../assets/logo.svg';

export function AuthHeader() {
  const isMobile = useMediaQuery('(max-width: 480px)');
  const isTablet = useMediaQuery('(max-width: 768px)');

  return (
    // Sayfanın üst kısmına sabitlenen ana kutu
    <Box
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: isTablet ? '16px' : '20px 24px',
        zIndex: 10,
      }}
    >
      <Group justify="space-between" align="center">
        {/* SVG Logo - responsive boyut */}
        <Image 
          src={logo} 
          h={isTablet ? 24 : 28}
          w="auto" 
          fit="contain"
          style={{
            filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
          }}
        />

        {/* Destek Butonu - responsive */}
        <Button
          variant="subtle"
          size={isTablet ? 'xs' : 'sm'}
          color="gray"
          leftSection={<IconHelpCircle size={isTablet ? 14 : 16} />}
          style={{
            fontWeight: 500,
            fontSize: isTablet ? '12px' : '14px',
            height: isTablet ? '32px' : '36px',
            borderRadius: isTablet ? '6px' : '8px',
            transition: 'all 0.2s ease',
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
          {isMobile ? 'Destek' : 'Destek İste'}
        </Button>
      </Group>
    </Box>
  );
}
