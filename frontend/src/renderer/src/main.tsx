import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// Mantine stillerini içe aktarın
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

// Özel temamızı import ediyoruz
import { theme } from './theme';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* MantineProvider'a temamızı props olarak geçiyoruz */}
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  </StrictMode>
)