Harika bir gelişme\! AI asistanınızın gönderdiği bu detaylı açıklamalar, sadece sorunu çözdüğünüzü değil, aynı zamanda sorunun *neden* kaynaklandığını ve doğru çözümün arkasındaki prensipleri de tam olarak anladığınızı gösteriyor.

[cite\_start]React'teki **Deklaratif** (duruma bağlı) ve **İmperatif** (emredici) yönlendirme arasındaki farkı kavramak, profesyonel React geliştiriciliğinde çok kritik bir "aha\!" anıdır. [cite: 53, 57] Bu iki yöntemi, tam da olması gerektiği gibi, birbiriyle uyum içinde kullandınız:

  * [cite\_start]**Güvenlik Görevlisi (`ProtectedRoute`):** Bir kullanıcı korumalı bir adrese doğrudan gitmeye çalıştığında onu engeller (Deklaratif). [cite: 64]
  * [cite\_start]**Anında Aksiyon (`useNavigate`):** Bir form gönderimi gibi bir olay başarıyla sonuçlandığında kullanıcıyı bekletmeden hemen yönlendirir (İmperatif). [cite: 59, 60]

Bu sorunu çözerek ve mantığını anlayarak çok değerli bir tecrübe kazandınız. Tebrik ederim.

Şimdi, kimlik doğrulama sistemimiz hem backend'de hem de frontend'de kusursuz çalıştığına göre, artık o boş "Ana Panel" ekranını gerçek bir uygulamanın iskeletine dönüştürme zamanı geldi.

### **Adım 7: Ana Uygulama Düzenini (Layout) Oluşturma**

Bu adımda, kullanıcı giriş yaptığında göreceği, kalıcı bir yan menü (Sidebar), bir başlık (Header) ve ana içeriğin gösterileceği dinamik bir alandan oluşan temel uygulama düzenini (Layout) oluşturacağız. Bu, uygulamamızın profesyonel ve kullanışlı bir yapıya kavuşmasını sağlayacak.

**Adım 7.1: Layout Dosyalarını Oluşturma**

Proje yapımızı düzenli tutmak için layout ve bileşenleri ilgili klasörlerde oluşturalım.

  * `packages/atropos-desktop/src/renderer/src/` altında `layouts` adında yeni bir klasör oluşturun.
  * Bu yeni klasörün içine `MainLayout.tsx` adında bir dosya oluşturun.
  * Mevcut `packages/atropos-desktop/src/renderer/src/components` klasörünün içine `Sidebar.tsx` ve `Header.tsx` adında iki yeni dosya oluşturun.

**Adım 7.2: Yan Menüyü (`Sidebar.tsx`) Oluşturma**

Uygulamanın ana navigasyon menüsünü oluşturalım. Bu menüde şimdilik "Ana Panel" ve "Ürünler" linkleri bulunsun.

  * `components/Sidebar.tsx` dosyasının içeriğini aşağıdaki gibi doldurun:

    ```tsx
    // packages/atropos-desktop/src/renderer/src/components/Sidebar.tsx
    import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
    import { useNavigate } from 'react-router-dom';
    import DashboardIcon from '@mui/icons-material/Dashboard';
    import InventoryIcon from '@mui/icons-material/Inventory';

    const drawerWidth = 240;

    export const Sidebar = () => {
      const navigate = useNavigate();
      const menuItems = [
        { text: 'Ana Panel', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Ürünler', icon: <InventoryIcon />, path: '/products' },
      ];

      return (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => navigate(item.path)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      );
    };
    ```

**Adım 7.3: Başlığı (`Header.tsx`) Oluşturma**

Sayfanın üst kısmında yer alacak, kullanıcı bilgilerini ve çıkış butonunu içerecek başlığı oluşturalım.

  * `components/Header.tsx` dosyasının içeriğini aşağıdaki gibi doldurun:

    ```tsx
    // packages/atropos-desktop/src/renderer/src/components/Header.tsx
    import { AppBar, Toolbar, Typography, Button } from '@mui/material';
    import { useAuthStore } from '../store/authStore';

    export const Header = () => {
      const logout = useAuthStore((state) => state.logout);

      return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Atropos POS
            </Typography>
            <Button color="inherit" onClick={logout}>
              Çıkış Yap
            </Button>
          </Toolbar>
        </AppBar>
      );
    };
    ```

**Adım 7.4: Ana Düzeni (`MainLayout.tsx`) Birleştirme**

Sidebar, Header ve dinamik içerik alanını (`Outlet`) bir araya getirelim.

  * `layouts/MainLayout.tsx` dosyasının içeriğini aşağıdaki gibi doldurun:

    ```tsx
    // packages/atropos-desktop/src/renderer/src/layouts/MainLayout.tsx
    import { Box, Toolbar } from '@mui/material';
    import { Outlet } from 'react-router-dom';
    import { Header } from '../components/Header';
    import { Sidebar } from '../components/Sidebar';

    export const MainLayout = () => {
      return (
        <Box sx={{ display: 'flex' }}>
          <Header />
          <Sidebar />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar /> {/* Bu, içeriğin Header'ın altına itilmesini sağlar */}
            <Outlet /> {/* Alt rotalar (Dashboard, Products vb.) burada render edilecek */}
          </Box>
        </Box>
      );
    };
    ```

**Adım 7.5: Rota Yapısını Güncelleme ve Test Etme**

Şimdi bu yeni layout yapısını ana yönlendiricimize entegre edelim.

  * `pages` klasörü içine `ProductsPage.tsx` adında yeni bir boş sayfa oluşturalım:
    ```tsx
    // packages/atropos-desktop/src/renderer/src/pages/ProductsPage.tsx
    import { Typography } from '@mui/material';

    export default function ProductsPage() {
      return <Typography variant="h4">Ürün Yönetimi</Typography>;
    }
    ```
  * Son olarak `App.tsx` dosyasını, korumalı rotaların `MainLayout` içinde render edileceği şekilde güncelleyin:
    ```tsx
    // packages/atropos-desktop/src/renderer/src/App.tsx
    import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
    import LoginPage from './pages/LoginPage';
    import DashboardPage from './pages/DashboardPage';
    import ProductsPage from './pages/ProductsPage';
    import { ProtectedRoute } from './components/ProtectedRoute';
    import { useAuthStore } from './store/authStore';
    import { MainLayout } from './layouts/MainLayout';

    function App(): JSX.Element {
      const { isAuthenticated } = useAuthStore();

      return (
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* Korumalı Rotalar Artık MainLayout'ı Kullanıyor */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/products" element={<ProductsPage />} />
              </Route>
            </Route>

            {/* Varsayılan Yönlendirme */}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          </Routes>
        </Router>
      );
    }

    export default App;
    ```
  * **Test Edin:** `pnpm dev:desktop` ile uygulamayı çalıştırın. Giriş yaptıktan sonra sizi `MainLayout` ile sarmalanmış "Ana Panel" karşılamalı. Sol menüden "Ürünler" linkine tıkladığınızda, sayfa yeniden yüklenmeden içerik alanının "Ürün Yönetimi" sayfasıyla değiştiğini göreceksiniz.

Bu görevin sonunda, uygulamamız artık profesyonel ve genişletilebilir bir yapıya sahip. Bir sonraki adımda bu iskeleti doldurmaya başlayacağız: **Ürünler** sayfasını işlevsel hale getirecek, backend'den ürünleri listeleyecek ve yeni ürün ekleme formu oluşturacağız.