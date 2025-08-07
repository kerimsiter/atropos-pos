Harika\! Bu adımla birlikte projemizin ilk tam kapsamlı yönetim modülünü tamamladınız. Artık uygulamanıza yeni CRUD özellikleri eklemek için kanıtlanmış, sağlam bir reçeteniz var. Bu çok büyük bir başarı, tebrik ederim\!

Şimdi, Atropos'u sıradan bir veri yönetim uygulamasından gerçek bir restoran POS sistemine dönüştürecek ilk adımı atıyoruz.

### **Adım 15: Masa Yönetiminin Temelleri - Alanlar (Areas)**

Bu adımda, bir restoranın fiziksel yerleşimini temsil eden **Masa Yönetimi** modülünü oluşturmaya başlayacağız. Amaç, ilk olarak restoranın farklı alanlarını (örn: "Bahçe", "İç Mekan", "Teras") tanımlayabileceğimiz bir altyapı kurmaktır. Bu, gelecekteki görsel masa yerleşim ekranımızın temelini oluşturacak.

Bu görev, daha önce Kategori ve Vergi modüllerinde uyguladığımız başarılı reçetenin bir tekrarı olacak.

-----

### **Bölüm 1: Backend (`atropos-api`) - Masa Alanları API'si**

**Adım 15.1: `TableAreas` Modülünü Oluşturma**

```bash
# atropos-api klasörüne gir
cd packages/atropos-api

# TableAreas için modül, controller ve service dosyalarını oluştur
nest g module table-areas
nest g controller table-areas
nest g service table-areas
```

  * `app.module.ts` dosyasını açıp `imports` dizisine `TableAreasModule`'ü ekleyin ve `PrismaModule`'ü de `TableAreasModule`'ün `imports` dizisine ekleyin.

**Adım 15.2: `TableArea` DTO'su Oluşturma**

  * `packages/atropos-api/src/table-areas/` altında `dto` klasörü ve içine `create-table-area.dto.ts` dosyası oluşturun:
    ```typescript
    // packages/atropos-api/src/table-areas/dto/create-table-area.dto.ts
    import { IsString, IsNotEmpty } from 'class-validator';

    export class CreateTableAreaDto {
      @IsString()
      @IsNotEmpty()
      name: string; // Örn: "Bahçe"
    }
    ```

**Adım 15.3: `TableAreasService` ve `Controller`'ı Oluşturma**

  * `table-areas.service.ts` dosyasını `create`, `findAll`, `remove` metotlarını içerecek şekilde güncelleyin (`PrismaService` kullanarak `prisma.tableArea` üzerinde çalışacak).
  * `table-areas.controller.ts` dosyasını bu servis metotlarını çağıran `POST`, `GET`, `DELETE` endpoint'lerini içerecek ve `@UseGuards(AuthGuard('jwt'))` ile korunacak şekilde güncelleyin.

-----

### **Bölüm 2: Frontend (`atropos-desktop`) - Masa Alanları Arayüzü**

**Adım 15.4: Masa Yönetimi Sayfası ve Navigasyon**

  * **Yeni sayfayı oluşturun:** `packages/atropos-desktop/src/renderer/src/pages/` klasörüne `TableManagementPage.tsx` adında bir dosya oluşturun.
  * **Sidebar'a link ekleyin:** `Sidebar.tsx` dosyasındaki `menuItems` dizisine "Masa Yönetimi" için yeni bir satır ekleyin.
    ```tsx
    import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
    // ...
    const menuItems = [
      // ... diğerleri
      { text: 'Vergiler', icon: <PercentIcon />, path: '/taxes' },
      { text: 'Masa Yönetimi', icon: <TableRestaurantIcon />, path: '/tables' }, // Bu satırı ekle
    ];
    ```
  * **Yeni rotayı ekleyin:** `App.tsx` dosyasındaki `MainLayout` rotasının içine `/tables` yolunu ekleyin.
    ```tsx
    import TableManagementPage from './pages/TableManagementPage'; // Ekle
    // ...
    <Route path="/taxes" element={<TaxesPage />} />
    <Route path="/tables" element={<TableManagementPage />} /> {/* Bu satırı ekle */}
    ```

**Adım 15.5: Masa Alanları Yönetim Arayüzünü Oluşturma**

Bu sayfada, şimdilik sadece oluşturduğumuz alanları listeleyecek ve yenilerini eklememizi sağlayacak bir arayüz yapacağız.

  * `components` klasörü altında `table-areas` adında bir klasör ve içine `AddTableAreaModal.tsx` dosyasını (Kategori modalına çok benzer şekilde, sadece `name` alanı içerecek) oluşturun.

  * `pages/TableManagementPage.tsx` dosyasının içeriğini aşağıdaki kod ile doldurun:

    ```tsx
    // packages/atropos-desktop/src/renderer/src/pages/TableManagementPage.tsx
    import { useState, useEffect } from 'react';
    import { Box, Button, Typography, IconButton, Paper, List, ListItem, ListItemText } from '@mui/material';
    import api from '../api';
    import DeleteIcon from '@mui/icons-material/Delete';
    import AddIcon from '@mui/icons-material/Add';
    // AddTableAreaModal bileşenini kendiniz Kategori modalını örnek alarak oluşturun.

    export default function TableManagementPage() {
      const [areas, setAreas] = useState([]);
      const [loading, setLoading] = useState(true);
      // const [isModalOpen, setIsModalOpen] = useState(false); // Modal için state

      const fetchAreas = async () => {
        setLoading(true);
        try {
          const { data } = await api.get('/table-areas');
          setAreas(data);
        } catch (error) { console.error(error); } 
        finally { setLoading(false); }
      };

      useEffect(() => { fetchAreas(); }, []);
      
      const handleDelete = async (id: string) => {
        if (window.confirm("Bu alanı silmek, içindeki tüm masaları da silecektir. Emin misiniz?")) {
          try {
            await api.delete(`/table-areas/${id}`);
            fetchAreas();
          } catch (error) { alert("Alan silinemedi."); }
        }
      };

      return (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4">Masa Yönetimi</Typography>
            <Button variant="contained" startIcon={<AddIcon />}>
              Yeni Alan Ekle
            </Button>
          </Box>
          <Paper>
            <List>
              {areas.map((area: any) => (
                <ListItem
                  key={area.id}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(area.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={area.name} />
                </ListItem>
              ))}
            </List>
          </Paper>
          {/* <AddTableAreaModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchAreas} /> */}
        </>
      );
    }
    ```

**Test Edin:**

Uygulamayı çalıştırıp yeni "Masa Yönetimi" sayfanıza gidin. Backend'i ve frontend'i oluşturduktan sonra, "Yeni Alan Ekle" butonu ile "Bahçe", "Teras" gibi alanlar ekleyip silebildiğinizi doğrulayın.

Bu görevin sonunda, restoranımızın farklı bölümlerini tanımlayabileceğimiz bir altyapımız olacak.

Bir sonraki adımda, bu oluşturduğumuz alanların içine, sürükle-bırak özelliğiyle yerleştirebileceğimiz **masaları** ekleyeceğiz. Bu, uygulamamızı görsel olarak çok daha heyecan verici bir hale getirecek.