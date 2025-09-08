import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mantine/hooks';
import { useForm } from '@mantine/form';
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
// YENİ: Telefon numarası bileşenini import ediyoruz
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

export function RegisterForm() {
  const navigate = useNavigate(); // Yönlendirme için hook
  const isMobile = useMediaQuery('(max-width: 480px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isSmallMobile = useMediaQuery('(max-width: 360px)');
  
  const form = useForm({
    initialValues: {
      businessName: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      termsAccepted: false,
    },

    validate: {
      businessName: (value) => (value.trim().length > 0 ? null : 'İşletme adı gerekli'),
      firstName: (value) => (value.trim().length > 0 ? null : 'Ad gerekli'),
      lastName: (value) => (value.trim().length > 0 ? null : 'Soyad gerekli'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Geçersiz e-posta adresi'),
      // Telefon numarası doğrulama
      phone: (value) => {
        if (!value.trim()) return 'Telefon numarası gerekli';
        // Basit telefon numarası format kontrolü
        const phoneRegex = /^\+[1-9]\d{1,14}$/; // E.164 formatı
        if (!phoneRegex.test(value)) return 'Geçersiz telefon numarası formatı';
        return null;
      },
      password: (value) => (value.length >= 6 ? null : 'Şifre en az 6 karakter olmalı'),
      termsAccepted: (value) => (value ? null : 'Kullanım koşullarını kabul etmelisiniz'),
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    console.log('Kayıt denemesi (form values):', values);
    
    try {
      const response = await fetch('http://localhost:3000/users', { // Backend'deki yeni Users endpoint'i
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.email, // E-postayı kullanıcı adı olarak kullanıyoruz
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          password: values.password,
          role: 'ADMIN', // Varsayılan rol
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('Kayıt başarılı:', data);
        // Başarılı kayıt sonrası giriş sayfasına yönlendir
        navigate('/');
      } else {
        console.error('Kayıt başarısız:', data);
        // Hata mesajını form'a ekle
        if (data.message) {
          form.setErrors({ email: data.message });
        } else {
          form.setErrors({ email: 'Kayıt başarısız oldu' });
        }
      }

    } catch (error) {
      console.error('API çağrısı hatası:', error);
      form.setErrors({ email: 'Sunucuya bağlanılamadı. Lütfen tekrar deneyin.' });
    }
  });

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
          {...form.getInputProps('businessName')}
          size={isSmallMobile ? "sm" : "md"}
        />
        
        <Group grow={!isMobile} style={{ flexDirection: isMobile ? 'column' : 'row' }}>
          <TextInput
            required
            label="Ad"
            placeholder="Adınızı girin"
            {...form.getInputProps('firstName')}
            size={isSmallMobile ? "sm" : "md"}
          />
          <TextInput
            required
            label="Soyad"
            placeholder="Soyadınızı girin"
            {...form.getInputProps('lastName')}
            size={isSmallMobile ? "sm" : "md"}
          />
        </Group>

        <TextInput
          required
          label="E-posta Adresi"
          placeholder="E-posta adresinizi girin"
          type="email"
          {...form.getInputProps('email')}
          size={isSmallMobile ? "sm" : "md"}
        />

        {/* Telefon Numarası Giriş Alanı */}
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
            value={form.values.phone}
            onChange={(phone) => form.setFieldValue('phone', phone)}
            placeholder="Telefon numaranızı girin"
            inputClassName="react-international-phone-input"
            inputProps={{
              'aria-invalid': form.errors.phone ? 'true' : 'false',
            }}
            style={{
              '--react-international-phone-height': isSmallMobile ? '44px' : isMobile ? '48px' : '56px',
              '--react-international-phone-font-size': isSmallMobile ? '14px' : isMobile ? '15px' : '16px',
            } as React.CSSProperties}
          />
          {form.errors.phone && (
            <Text size="xs" c="red" mt={4}>
              {form.errors.phone}
            </Text>
          )}
        </div>

        <PasswordInput
          required
          label="Şifre"
          placeholder="Güçlü bir şifre belirleyin"
          {...form.getInputProps('password')}
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
          {...form.getInputProps('termsAccepted', { type: 'checkbox' })}
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