// frontend/src/renderer/src/theme.ts
import { createTheme } from '@mantine/core';

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
    fontWeight: '700', // Varsayılan olarak başlıklar Bold olsun
  },

  // 3. Bileşen Stilleri (Global)
  components: {
    Button: {
      defaultProps: {
        radius: 'md', // Butonların köşeleri hafif yuvarlak olsun
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    PasswordInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    // Diğer tüm form elemanları için de benzer ayarlar eklenebilir
  },
});
