// frontend/src/renderer/src/pages/Auth/Login.tsx
import { Grid, Stack, Title, Text, Image } from '@mantine/core';
import { AuthImagePanel } from '../../components/Auth/AuthImagePanel';
import { LoginForm } from '../../components/Auth/LoginForm';
import logo from '../../assets/logo.svg';

export function LoginPage(): React.JSX.Element {
  return (
    <Grid gutter={0}>
      {/* Sol Sütun: Form */}
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Stack
          justify="center"
          align="stretch"
          style={{ height: '100vh', padding: 'var(--mantine-spacing-xl)' }}
        >
          {/* Logo */}
          <Image src={logo} h={32} w="auto" fit="contain" style={{ alignSelf: 'flex-start' }} />

          {/* Başlık */}
          <Stack gap="xs" mt="xl" mb="xl">
            <Title order={2}>Login</Title>
            <Text c="dimmed">Access your account to continue</Text>
          </Stack>

          {/* Form Bileşeni */}
          <LoginForm />
        </Stack>
      </Grid.Col>

      {/* Sağ Sütun: Görsel */}
      <Grid.Col span={{ base: 0, md: 6 }} visibleFrom="md">
        <AuthImagePanel />
      </Grid.Col>
    </Grid>
  );
}
