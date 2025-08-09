// packages/atropos-desktop/src/renderer/src/theme.ts
import { createTheme } from '@mui/material/styles';

// Figma renk sistemine göre palet
// Primary: #8B9373, Light: #E4E6DE, Medium: #C3C7B7
// Secondary: #F4A754, Medium: #F9CE9F, Light: #FDF3E7
// Feedback: Error #FC6363, Warning #FFB546, Success #06C698
// Background / Paper / Stroke / Text
const palette = {
  primary: {
    main: '#8B9373',
    light: '#E4E6DE',
    dark: '#6F765C',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#F4A754',
    light: '#FDF3E7',
    dark: '#C38543',
    contrastText: '#111111',
  },
  // Custom: erişim için palette.extensions altında tutuyoruz (type genişletmemek için any ile kullanacağız)
  extensions: {
    primaryMedium: '#C3C7B7',
    secondaryMedium: '#F9CE9F',
    stroke: '#EEEEEE',
  },
  error: { main: '#FC6363' },
  warning: { main: '#FFB546' },
  success: { main: '#06C698' },
  background: {
    default: '#FAFAFA',
    paper: '#FFFFFF',
  },
  divider: '#EEEEEE',
  text: {
    primary: '#111111',
    secondary: '#808080',
  },
} as any;

export const theme = createTheme({
  palette: palette as any,

  // Tipografi (Figma: Space Grotesk / Body 16-23, Headline 16-23 bold, Title1 24-38 bold)
  typography: {
    fontFamily: '"Space Grotesk", "Poppins", sans-serif',
    // Title 1
    h5: { fontWeight: 700, fontSize: '24px', lineHeight: '38px' },
    // Headline
    h6: { fontWeight: 700, fontSize: '16px', lineHeight: '23px' },
    // Başlık hiyerarşisi için makul varsayılanlar
    h4: { fontWeight: 700 },
    body1: { fontSize: '16px', lineHeight: '23px', fontWeight: 400 },
    caption: { fontSize: '14px', lineHeight: '16px', fontWeight: 400 }, // Caption 2
    overline: { fontSize: '14px', lineHeight: '22px', fontWeight: 700, textTransform: 'none' }, // Caption 1
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
          boxShadow: 'none',
        },
      },
    },
    // Kartlar ve Paneller
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 12px rgba(0,0,0,0.05)',
          border: `1px solid ${(palette as any).extensions.stroke}`,
        },
      },
    },
    // Yan Menü
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF', // Yan menü arkaplanı
          borderRight: '1px solid #EEEEEE',
        }
      }
    },
    // Üst Başlık
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: (palette as any).primary.main,
          boxShadow: 'none',
        }
      }
    }
  },
});

