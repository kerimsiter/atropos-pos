import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mantine/hooks';
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Stack,
  Anchor,
  Text,
  Title,
  Group,
} from '@mantine/core';

export function RegisterForm() {
  const navigate = useNavigate(); // Yönlendirme için hook
  const isMobile = useMediaQuery('(max-width: 480px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  
  const [businessName, setBusinessName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Kayıt denemesi:', {
      businessName,
      firstName,
      lastName,
      email,
      password,
      termsAccepted,
    });
    // TODO: Kayıt olma mantığı buraya eklenecek
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="lg">
        {/* Başlık */}
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
            Hesap Oluşturun
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
            Yeni bir hesap oluşturarak başlayın.
          </Text>
        </Stack>

        <TextInput
          required
          label="İşletme Adı"
          placeholder="İşletmenizin adını girin"
          value={businessName}
          onChange={(event) => setBusinessName(event.currentTarget.value)}
        />
        
        <Group grow={!isMobile} style={{ flexDirection: isMobile ? 'column' : 'row' }}>
          <TextInput
            required
            label="Ad"
            placeholder="Adınızı girin"
            value={firstName}
            onChange={(event) => setFirstName(event.currentTarget.value)}
          />
          <TextInput
            required
            label="Soyad"
            placeholder="Soyadınızı girin"
            value={lastName}
            onChange={(event) => setLastName(event.currentTarget.value)}
          />
        </Group>

        <TextInput
          required
          label="E-posta Adresi"
          placeholder="E-posta adresinizi girin"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
        />

        <PasswordInput
          required
          label="Şifre"
          placeholder="Güçlü bir şifre belirleyin"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
        />

        <Checkbox
          required
          mt="md"
          label={
            <Text size="sm">
              <Anchor href="#" target="_blank">
                Kullanım Koşulları
              </Anchor>
              'nı okudum ve kabul ediyorum.
            </Text>
          }
          checked={termsAccepted}
          onChange={(event) => setTermsAccepted(event.currentTarget.checked)}
        />

        <Button fullWidth mt={isTablet ? 'lg' : 'xl'} type="submit" size={isMobile ? 'md' : 'lg'}>
          Kayıt Ol
        </Button>

        <Text ta="center" size="sm" c="neutral.6" style={{ fontSize: isMobile ? '12px' : '14px' }}>
          Zaten bir hesabınız var mı?{' '}
          <Anchor component="button" c="brand" onClick={() => navigate('/')}>
            Giriş Yap
          </Anchor>
        </Text>
      </Stack>
    </form>
  );
}