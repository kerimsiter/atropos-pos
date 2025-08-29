// frontend/src/renderer/src/pages/Auth/Login.tsx

import React, { useState } from 'react';
import {
  Container,
  Title,
  Stack,
  TextInput,
  PasswordInput,
  Button,
  Box,
  Text,
  Center,
} from '@mantine/core';
import { IconMail, IconLock, IconBox } from '@tabler/icons-react';

export function LoginPage(): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Body stillerini sıfırla
  React.useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Cleanup
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
    };
  }, []);

  return (
    // Sayfayı kaplayan ve içeriği ortalayan ana kutu
    <Box
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#25262b', // Koyu tema arkaplanı
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      <Container size={420} my={40}>
        <Stack gap="lg">
          {/* Logo Alanı */}
          <Center>
            <IconBox size={48} color="white" />
            <Title order={1} c="white" ml="sm">
              POS
            </Title>
          </Center>

          {/* Form Alanları */}
          <TextInput
            label={<Text c="dimmed">E-Posta</Text>}
            placeholder="ornek@mail.com"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            leftSection={<IconMail size={16} />}
            radius="md"
            size="md"
            styles={{ input: { backgroundColor: '#fff', color: '#000' } }}
          />

          <PasswordInput
            label={<Text c="dimmed">Şifre</Text>}
            placeholder="Şifreniz"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            leftSection={<IconLock size={16} />}
            radius="md"
            size="md"
            styles={{ input: { backgroundColor: '#fff', color: '#000' } }}
          />

          {/* Butonlar */}
          <Stack gap="xs" mt="md">
            <Button fullWidth size="md" radius="md">
              Giriş Yap
            </Button>

            <Button
              fullWidth
              variant="subtle" // Link gibi görünmesi için
              c="dimmed"
            >
              Şifremi Unuttum
            </Button>

            <Button
              fullWidth
              variant="outline" // "Hayalet" buton stili
              size="md"
              radius="md"
            >
              Kayıt Ol
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
