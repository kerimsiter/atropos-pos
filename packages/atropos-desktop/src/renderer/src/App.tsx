// packages/atropos-desktop/src/renderer/src/App.tsx

import { Button, Stack, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

function App(): JSX.Element {
  return (
    <Stack spacing={2} sx={{ p: 4 }} alignItems="flex-start">
      <Typography variant="h4">Atropos POS Arayüzü</Typography>
      <Typography>Font ve Renk Testi</Typography>
      
      <Stack direction="row" spacing={2}>
        <Button variant="contained">Birincil Buton</Button>
        <Button variant="contained" color="secondary">
          İkincil Buton
        </Button>
        <Button variant="contained" color="success" startIcon={<SendIcon />}>
          Başarılı
        </Button>
        <Button variant="outlined" color="error">
          Hata
        </Button>
      </Stack>
    </Stack>
  );
}

export default App;
