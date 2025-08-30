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
  Divider,
  Text,
} from '@mantine/core';
import { IconBrandGoogle } from '@tabler/icons-react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password, rememberMe });
    // TODO: Implement login logic
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="lg">
        <TextInput
          required
          label="Email or Phone Number"
          placeholder="Enter your phone number"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          radius="md"
          size="md"
        />
        <PasswordInput
          required
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          radius="md"
          size="md"
        />
        <Group justify="space-between">
          <Checkbox
            label="Remember me"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.currentTarget.checked)}
          />
          <Anchor component="button" size="sm" c="brand">
            Forgot password?
          </Anchor>
        </Group>

        <Button fullWidth size="md" mt="xl" type="submit">
          Login
        </Button>

        <Text size="sm" c="dimmed" ta="center">
          Don't have an account?{' '}
          <Anchor component="button" c="brand" fw={500}>
            Sign Up
          </Anchor>
        </Text>

        <Divider label="Or" labelPosition="center" my="sm" />

        <Button
          fullWidth
          size="md"
          variant="default"
          leftSection={<IconBrandGoogle size={16} />}
        >
          Continue With Google
        </Button>
      </Stack>
    </form>
  );
}
