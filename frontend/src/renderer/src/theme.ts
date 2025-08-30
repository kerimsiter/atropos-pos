// frontend/src/renderer/src/theme.ts
import { createTheme, rem } from '@mantine/core';

// Yeni Renk Paletimiz - Referans Tasarımdan
const themeColors = {
  brand: [
    '#e8f6ed', '#c7e9d4', '#9bd7b1', '#6cc58d',
    '#40b46b', '#16a34a', '#138b3f', '#107435',
    '#0d5d2a', '#0a4921',
  ] as const,
  neutral: [
    '#ffffff', '#fdfdfd', '#f5f6f6', '#e8f2f2',
    '#dadddc', '#c1c6c5', '#5d6b68', '#495955',
    '#2b3d39', '#243632',
  ] as const,
};

export const theme = createTheme({
  // 1. Renk Paleti - YENİ
  colors: {
    brand: themeColors.brand,
    neutral: themeColors.neutral,
  },

  // Ana rengimiz 'brand' (yeşil) olacak
  primaryColor: 'brand',
  primaryShade: 5, // Yeni ana renk #16a34a

  // 2. Tipografi (URBANIST YAZI TİPİ)
  fontFamily: "'Urbanist', sans-serif",
  headings: {
    fontFamily: "'Urbanist', sans-serif",
    fontWeight: '700', // Başlıkları daha belirgin yapalım
  },

  // 3. Bileşen Stilleri (Global) - ÇOK BÜYÜK VE CANLI TASARIM
  components: {
    // === BUTONLAR - YENİ RENK PALETİYLE ===
    Button: {
      defaultProps: {
        radius: 'md',
        size: 'xl',
      },
      styles: {
        root: {
          height: rem(56),
          fontSize: rem(18),
          fontWeight: 600,
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 20px rgba(22, 163, 74, 0.25)`, // Yeni marka rengiyle gölge
          },
        },
      },
    },

    // === GİRİŞ ALANLARI - YENİ STİL: Gri Arkaplan, Kenarlıksız ===
    TextInput: {
      defaultProps: {
        radius: 'md',
        size: 'xl',
        variant: 'filled', // Kenarlığı kaldırıp arkaplan rengi vermemizi sağlar
      },
      styles: {
        input: {
          backgroundColor: themeColors.neutral[2], // #f5f6f6 gri arkaplan
          height: rem(56),
          fontSize: rem(16),
          fontWeight: 500,
          border: '1px solid transparent', // Varsayılan kenarlığı şeffaf yap
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          '&:focus, &:focus-within': {
            borderColor: 'var(--mantine-color-brand-5)', // Odaklanınca yeşil kenarlık
            boxShadow: `0 0 0 ${rem(3)} rgba(22, 163, 74, 0.15)`,
          },
        },
        label: {
          fontSize: rem(16),
          fontWeight: 600,
          marginBottom: rem(10),
        },
      },
    },

    // === ŞİFRE ALANLARI - YENİ STİL ===
    PasswordInput: {
      defaultProps: {
        radius: 'md',
        size: 'xl',
        variant: 'filled',
      },
      styles: {
        input: {
          backgroundColor: themeColors.neutral[2],
          height: rem(56),
          fontSize: rem(16),
          fontWeight: 500,
          border: '1px solid transparent',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          '&:focus, &:focus-within': {
            borderColor: 'var(--mantine-color-brand-5)',
            boxShadow: `0 0 0 ${rem(3)} rgba(22, 163, 74, 0.15)`,
          },
        },
        label: {
          fontSize: rem(16),
          fontWeight: 600,
          marginBottom: rem(10),
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
          fontFamily: "'Urbanist', sans-serif", // Urbanist yazı tipi
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
