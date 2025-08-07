// packages/atropos-desktop/src/renderer/src/theme.ts

import { createTheme } from '@mui/material/styles';

// Atropos Renk Paleti
const palette = {
  primary: {
    main: '#8B9373', // Ana Yeşil
  },
  secondary: {
    main: '#F4A754', // Ana Turuncu
  },
  error: {
    main: '#FC6363', // Hata Rengi
  },
  warning: {
    main: '#FFB546', // Uyarı Rengi
  },
  success: {
    main: '#06C698', // Başarı Rengi
  },
  grey: {
    '300': '#C3C7B7', // Gri Ton 1
    '100': '#E4E6DE', // Gri Ton 2
  },
  background: {
    default: '#FAFAFA', // Ana Arkaplan (Aydınlık Tema)
    paper: '#FFFFFF', // Kart, menü gibi bileşenlerin arkaplanı
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.6)',
  },
};

export const theme = createTheme({
  palette: palette,
  typography: {
    fontFamily: '"Space Grotesk", sans-serif',
  },
  components: {
    // İleride buraya genel bileşen stillerini ekleyebiliriz.
    // Örn: Butonların kenar yuvarlaklığını değiştirmek gibi.
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Buton yazılarını büyük harfe çevirme
          borderRadius: 8,
        },
      },
    },
  },
});

