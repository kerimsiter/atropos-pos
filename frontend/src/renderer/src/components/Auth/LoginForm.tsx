// frontend/src/renderer/src/components/Auth/LoginForm.tsx
import { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Stack,
  Group,
  Anchor,
  Text,
  Title,
} from '@mantine/core';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Giriş denemesi:', { email, password, rememberMe });
    // TODO: Giriş yapma mantığı buraya eklenecek
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="lg">
        {/* Hoşgeldin Mesajı */}
        <Stack gap="xs" align="center" mb="lg">
          <Title order={3} size="24px" c="dark.8" ta="center" style={{ lineHeight: '32px', fontWeight: 600 }}>
            Hoşgeldiniz
          </Title>
          <Text c="neutral.6" size="14px" ta="center" style={{ lineHeight: '20px', maxWidth: '280px' }}>
            Lütfen üyelik bilgileriniz ile giriş yapınız
          </Text>
        </Stack>

        <TextInput
          required
          label="E-posta Adresi"
          placeholder="E-posta adresinizi girin"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          // radius ve size kaldırıldı, çünkü temadan geliyor
        />
        <PasswordInput
          required
          label="Şifre"
          placeholder="Şifrenizi girin"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          // radius ve size kaldırıldı, çünkü temadan geliyor
        />
        <Group justify="space-between">
          <Checkbox
            label="Beni Hatırla"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.currentTarget.checked)}
          />
          <Anchor component="button" size="sm" c="brand">
            Şifremi unuttum
          </Anchor>
        </Group>

        <Button fullWidth mt="xl" type="submit">
          Giriş Yap
        </Button>

        <Button fullWidth variant="default">
          Kayıt Ol
        </Button>
      </Stack>
    </form>
  );
}
