// frontend/src/renderer/src/App.tsx
import { LoginPage } from './pages/Auth/Login';

function App(): React.JSX.Element {
  // Şimdilik doğrudan Login sayfasını gösteriyoruz.
  // İleride buraya router (sayfa yönlendiricisi) gelecek.
  return <LoginPage />;
}

export default App