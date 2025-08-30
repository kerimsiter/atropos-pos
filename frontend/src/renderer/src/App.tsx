// frontend/src/renderer/src/App.tsx
import { HashRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/Auth/Login';
import { RegisterPage } from './pages/Auth/RegisterPage';

function App(): React.JSX.Element {
  return (
    <HashRouter>
      <Routes>
        {/* Varsayılan olarak giriş sayfasını göster */}
        <Route path="/" element={<LoginPage />} />
        
        {/* /register adresine gidildiğinde kayıt sayfasını göster */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Buraya ileride yeni sayfalar eklenecek, örn: /dashboard */}
      </Routes>
    </HashRouter>
  );
}

export default App