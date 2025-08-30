// frontend/src/renderer/src/theme.ts
import { createTheme, rem } from '@mantine/core';

export const theme = createTheme({
  // 1. Renk Paleti
  colors: {
    // Tasarım sistemindeki 'Primary' rengini 'brand' olarak tanımlıyoruz
    brand: [
      '#F2FAF5', // brand[0] - Primary 50
      '#E6F5EB', // brand[1]
      '#C1E6CF', // brand[2]
      '#9BD8B3', // brand[3]
      '#74CA97', // brand[4]
      '#4DBD7B', // brand[5] - Primary 500'e en yakın
      '#30B55B', // brand[6] - **ANA RENK (Primary 500)**
      '#29A150', // brand[7]
      '#228D45', // brand[8]
      '#1B793A', // brand[9] - Primary 900'e en yakın
    ],
  },

  // Ana rengimiz 'brand' (yeşil) olacak
  primaryColor: 'brand',
  primaryShade: 6, // Ana renk olarak brand[6]'yı kullan

  // 2. Tipografi
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  headings: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: '600', // Semi-bold - daha zarif görünüm için
  },

  // 3. Bileşen Stilleri (Global) - ÇOK BÜYÜK VE CANLI TASARIM
  components: {
    // === BUTONLAR - ÇOK BÜYÜK VE ETKİLEŞİMLİ ===
    Button: {
      defaultProps: {
        radius: 'md',
        size: 'xl', // Çok büyük butonlar
      },
      styles: {
        root: {
          height: rem(56), // Çok yüksek butonlar (50px'den daha büyük)
          fontSize: rem(18), // Büyük yazı
          fontWeight: 600, // Kalın yazı
          transition: 'transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
          // Hover efekti - buton yukarı kalksın ve gölge eklensin
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(48, 181, 91, 0.3)', // Marka renginde gölge
          },
          // Focus efekti - daha belirgin olsun
          '&:focus': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(48, 181, 91, 0.4)',
          },
        },
      },
    },

    // === GİRİŞ ALANLARI - ÇOK BÜYÜK VE CANLI ===
    TextInput: {
      defaultProps: {
        radius: 'md',
        size: 'xl', // Çok büyük input alanları
      },
      styles: {
        input: {
          height: rem(56), // Çok yüksek input'lar (50px'den daha büyük)
          fontSize: rem(16), // Büyük yazı
          fontWeight: 500, // Orta kalınlık
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease',
          // Focus efekti - marka renginde çerçeve ve gölge
          '&:focus': {
            borderColor: 'var(--mantine-color-brand-6)',
            boxShadow: `0 0 0 ${rem(3)} rgba(48, 181, 91, 0.2)`,
            transform: 'translateY(-1px)',
          },
          // Hover efekti - hafif gölge
          '&:hover': {
            boxShadow: `0 2px 8px rgba(0, 0, 0, 0.08)`,
          },
        },
        label: {
          fontSize: rem(16), // Büyük label
          fontWeight: 600, // Kalın label
          marginBottom: rem(10), // Label ile input arası daha fazla boşluk
          transition: 'color 0.15s ease',
        },
      },
    },

    // === ŞİFRE ALANLARI - ÇOK BÜYÜK VE CANLI ===
    PasswordInput: {
      defaultProps: {
        radius: 'md',
        size: 'xl', // Çok büyük şifre alanları
      },
      styles: {
        input: {
          height: rem(56), // Çok yüksek şifre input'ları
          fontSize: rem(16), // Büyük yazı
          fontWeight: 500, // Orta kalınlık
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease',
          // Focus efekti - marka renginde çerçeve ve gölge
          '&:focus': {
            borderColor: 'var(--mantine-color-brand-6)',
            boxShadow: `0 0 0 ${rem(3)} rgba(48, 181, 91, 0.2)`,
            transform: 'translateY(-1px)',
          },
          // Hover efekti - hafif gölge
          '&:hover': {
            boxShadow: `0 2px 8px rgba(0, 0, 0, 0.08)`,
          },
        },
        label: {
          fontSize: rem(16), // Büyük label
          fontWeight: 600, // Kalın label
          marginBottom: rem(10), // Label ile input arası daha fazla boşluk
          transition: 'color 0.15s ease',
        },
      },
    },

    // === DİĞER FORM ELEMANLARI ===
    Checkbox: {
      styles: {
        input: {
          borderRadius: '6px',
          transition: 'border-color 0.15s ease',
          width: rem(20), // Daha büyük checkbox
          height: rem(20), // Daha büyük checkbox
        },
        label: {
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 600, // Kalın yazı
          fontSize: rem(16), // Büyük yazı
          color: '#141414',
          transition: 'color 0.15s ease',
        },
      },
    },

    // === SELECT VE TEXTAREA - DAHA BÜYÜK ===
    Select: {
      defaultProps: {
        radius: 'md',
        size: 'xl',
      },
      styles: {
        input: {
          height: rem(56),
          fontSize: rem(16),
          fontWeight: 500,
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          '&:focus': {
            borderColor: 'var(--mantine-color-brand-6)',
            boxShadow: `0 0 0 ${rem(3)} rgba(48, 181, 91, 0.2)`,
          },
          '&:hover': {
            boxShadow: `0 2px 8px rgba(0, 0, 0, 0.08)`,
          },
        },
        label: {
          fontSize: rem(16),
          fontWeight: 600,
          marginBottom: rem(10),
        },
      },
    },

    Textarea: {
      defaultProps: {
        radius: 'md',
        size: 'xl',
      },
      styles: {
        input: {
          fontSize: rem(16),
          fontWeight: 500,
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          '&:focus': {
            borderColor: 'var(--mantine-color-brand-6)',
            boxShadow: `0 0 0 ${rem(3)} rgba(48, 181, 91, 0.2)`,
          },
          '&:hover': {
            boxShadow: `0 2px 8px rgba(0, 0, 0, 0.08)`,
          },
        },
        label: {
          fontSize: rem(16),
          fontWeight: 600,
          marginBottom: rem(10),
        },
      },
    },
  },
});
