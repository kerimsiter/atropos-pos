// packages/atropos-desktop/src/renderer/src/theme.ts
import { createTheme } from '@mui/material/styles';

// Senin belirlediğin ana renkleri temel alan genişletilmiş palet
const palette = {
  primary: {
    main: '#8B9373', // Ana Yeşil
    light: '#C3C7B7',
    dark: '#6F765C',
  },
  secondary: {
    main: '#F4A754', // Ana Turuncu
    light: '#F9CE9F',
    dark: '#C38543',
  },
  error: { main: '#FC6363' },
  warning: { main: '#FFB546' },
  success: { main: '#06C698' },
  background: {
    default: '#FAFAFA', // Sayfaların genel arkaplanı
    paper: '#FFFFFF',   // Kartların ve panellerin arkaplanı
  },
};

export const theme = createTheme({
  palette: palette as any,
  
  // Yazı Tipi Hiyerarşisi
  typography: {
    fontFamily: '"Space Grotesk", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },

  // Genel Bileşen Stilleri (Projenin kimliği burada şekilleniyor)
  components: {
    // Butonlar
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none', // Buton yazıları büyük harf olmasın
          fontWeight: 600,
        },
      },
    },
    // Kartlar ve Paneller
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
    // Yan Menü
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF', // Yan menü arkaplanı
          borderRight: 'none',
        }
      }
    },
    // Üst Başlık
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: (palette as any).primary.main, // Başlık arkaplanı ana yeşil
          boxShadow: 'none', // Daha modern ve düz bir görünüm için gölgeyi kaldır
        }
      }
    }
  },
});

