// frontend/src/renderer/src/components/Auth/LoginForm.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mantine/hooks';
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
  const navigate = useNavigate(); // Yönlendirme için hook
  const isMobile = useMediaQuery('(max-width: 480px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  
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
        <Stack gap="xs" align="center" mb={isTablet ? 'md' : 'lg'}>
          <Title 
            order={2} 
            size={isMobile ? '28px' : '32px'} 
            c="dark.8" 
            ta="center" 
            style={{ 
              lineHeight: isMobile ? '36px' : '40px', 
              fontWeight: 600 
            }}
          >
            Hoşgeldiniz
          </Title>
          <Text 
            c="neutral.6" 
            size={isMobile ? '14px' : '16px'} 
            ta="center" 
            style={{ 
              lineHeight: isMobile ? '20px' : '24px', 
              maxWidth: isMobile ? '280px' : '320px'
            }}
          >
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
        <Group justify="space-between" align={isMobile ? 'flex-start' : 'center'} style={{ flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '12px' : '0' }}>
          <Checkbox
            label="Beni Hatırla"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.currentTarget.checked)}
            size={isMobile ? 'sm' : 'md'}
          />
          <Anchor component="button" size="sm" c="brand">
            Şifremi unuttum
          </Anchor>
        </Group>

        <Button fullWidth mt={isTablet ? 'lg' : 'xl'} type="submit" size={isMobile ? 'md' : 'lg'}>
          Giriş Yap
        </Button>

        <Button fullWidth variant="default" onClick={() => navigate('/register')} size={isMobile ? 'md' : 'lg'}>
          Kayıt Ol
        </Button>
      </Stack>
    </form>
  );
}
