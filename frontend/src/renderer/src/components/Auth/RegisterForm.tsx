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
  rem,
} from '@mantine/core';
// YENİ: Telefon numarası bileşenini import ediyoruz
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

export function RegisterForm() {
  const navigate = useNavigate(); // Yönlendirme için hook
  const isMobile = useMediaQuery('(max-width: 480px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isSmallMobile = useMediaQuery('(max-width: 360px)');
  
  const [businessName, setBusinessName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  // YENİ: Telefon numarası için state
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Kayıt denemesi:', {
      businessName,
      firstName,
      lastName,
      email,
      phone, // Konsola telefon numarasını da yazdır
      password,
      termsAccepted,
    });
    // TODO: Kayıt olma mantığı buraya eklenecek
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={isSmallMobile ? "md" : isMobile ? "lg" : "lg"}>
        {/* Başlık */}
        <Stack gap="xs" align="center" mb={isSmallMobile ? 'sm' : isTablet ? 'md' : 'lg'}>
          <Title 
            order={2} 
            size={isSmallMobile ? '24px' : isMobile ? '28px' : '32px'} 
            c="dark.8" 
            ta="center" 
            style={{ 
              lineHeight: isSmallMobile ? '32px' : isMobile ? '36px' : '40px', 
              fontWeight: 600 
            }}
          >
            Hesap Oluşturun
          </Title>
          <Text 
            c="neutral.6" 
            size={isSmallMobile ? '13px' : isMobile ? '14px' : '16px'} 
            ta="center" 
            style={{ 
              lineHeight: isSmallMobile ? '18px' : isMobile ? '20px' : '24px', 
              maxWidth: isSmallMobile ? '260px' : isMobile ? '280px' : '320px'
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
          size={isSmallMobile ? "sm" : "md"}
        />
        
        <Group grow={!isMobile} style={{ flexDirection: isMobile ? 'column' : 'row' }}>
          <TextInput
            required
            label="Ad"
            placeholder="Adınızı girin"
            value={firstName}
            onChange={(event) => setFirstName(event.currentTarget.value)}
            size={isSmallMobile ? "sm" : "md"}
          />
          <TextInput
            required
            label="Soyad"
            placeholder="Soyadınızı girin"
            value={lastName}
            onChange={(event) => setLastName(event.currentTarget.value)}
            size={isSmallMobile ? "sm" : "md"}
          />
        </Group>

        <TextInput
          required
          label="E-posta Adresi"
          placeholder="E-posta adresinizi girin"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          size={isSmallMobile ? "sm" : "md"}
        />

        {/* YENİ: Telefon Numarası Giriş Alanı */}
        <div>
          <Text 
            component="label" 
            size={isSmallMobile ? "xs" : "sm"} 
            fw={500} 
            mb={5}
          >
            Telefon Numarası <span style={{ color: 'red' }}>*</span>
          </Text>
          <PhoneInput
            defaultCountry="tr"
            value={phone}
            onChange={(phone) => setPhone(phone)}
            placeholder="Telefon numaranızı girin"
            inputClassName="mantine-phone-input"
            style={{
              '--react-international-phone-height': isSmallMobile ? '44px' : isMobile ? '48px' : '56px',
              '--react-international-phone-font-size': isSmallMobile ? '14px' : isMobile ? '15px' : '16px',
            } as React.CSSProperties}
          />
        </div>

        <PasswordInput
          required
          label="Şifre"
          placeholder="Güçlü bir şifre belirleyin"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          size={isSmallMobile ? "sm" : "md"}
        />

        <Checkbox
          required
          mt={isSmallMobile ? "sm" : "md"}
          label={
            <Text size={isSmallMobile ? "xs" : "sm"}>
              <Anchor href="#" target="_blank">
                Kullanım Koşulları
              </Anchor>
              'nı okudum ve kabul ediyorum.
            </Text>
          }
          checked={termsAccepted}
          onChange={(event) => setTermsAccepted(event.currentTarget.checked)}
          size={isSmallMobile ? "sm" : "md"}
        />

        <Button 
          fullWidth 
          mt={isSmallMobile ? 'md' : isTablet ? 'lg' : 'xl'} 
          type="submit" 
          size={isSmallMobile ? 'sm' : isMobile ? 'md' : 'lg'}
        >
          Kayıt Ol
        </Button>

        <Text 
          ta="center" 
          size={isSmallMobile ? "xs" : "sm"} 
          c="neutral.6" 
          style={{ 
            fontSize: isSmallMobile ? '11px' : isMobile ? '12px' : '14px',
            lineHeight: isSmallMobile ? '16px' : isMobile ? '18px' : '20px'
          }}
        >
          Zaten bir hesabınız var mı?{' '}
          <Anchor component="button" c="brand" onClick={() => navigate('/')}>
            Giriş Yap
          </Anchor>
        </Text>
      </Stack>
    </form>
  );
}