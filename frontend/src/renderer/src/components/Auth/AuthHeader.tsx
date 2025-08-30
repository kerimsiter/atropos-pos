// frontend/src/renderer/src/components/Auth/AuthHeader.tsx
import { Box, Button, Group, Image } from '@mantine/core';
import { IconHelpCircle } from '@tabler/icons-react';
import logo from '../../assets/logo.svg';

export function AuthHeader() {
  return (
    // Sayfanın üst kısmına sabitlenen ana kutu
    <Box
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: 'var(--mantine-spacing-xl)', // Kenar boşlukları
      }}
    >
      <Group justify="space-between">
        {/* SVG Logo */}
        <Image src={logo} h={30} w="auto" fit="contain" />

        {/* Destek Butonu */}
        <Button
          variant="outline"
          size="sm" // Temadaki 'xl' boyutunu ezip daha küçük bir buton yapıyoruz
          leftSection={<IconHelpCircle size={18} />}
        >
          Destek İste
        </Button>
      </Group>
    </Box>
  );
}
