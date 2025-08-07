Harika\! AI asistanınızın raporu, uygulama iskeletimizin başarıyla kurulduğunu ve tam olarak planlandığı gibi çalıştığını teyit ediyor. Artık boş bir tuvalimiz değil, üzerine sanatımızı işleyeceğimiz sağlam bir şasimiz var. Bu profesyonel temel üzerine ilk tam fonksiyonel modülümüzü inşa etmeye hazırız.

Şimdiye kadar kimlik doğrulama, arayüz iskeleti gibi "altyapı" işleriyle uğraştık. Şimdi ise projenin asıl amacına, yani bir POS uygulamasının temel özelliklerine odaklanma zamanı.

### **Adım 8: İlk Full-Stack Özellik: Ürün Yönetimi**

Bu adımda, baştan sona ilk özelliğimizi geliştireceğiz. Backend'de ürünleri yönetmek için API'ler oluşturacak, ardından Frontend'de bu ürünleri listeleyeceğimiz ve sileceğimiz bir arayüz tasarlayacağız. Bu, projenin temel veri akışını anlamak için mükemmel bir pratik olacak.

-----

### **Bölüm 1: Backend (`atropos-api`) - Ürünler API'si**

**Adım 8.1: `Products` Modülünü Oluşturma**

Öncelikle, ürünlerle ilgili tüm mantığı barındıracak olan modülü NestJS CLI ile oluşturalım.

```bash
# atropos-api klasörüne gir
cd packages/atropos-api

# Products için modül, controller ve service dosyalarını oluştur
nest g module products
nest g controller products
nest g service products
```

  * Oluşturulan `ProductsModule`'ü ana modüle tanıtmak için `packages/atropos-api/src/app.module.ts` dosyasını açın ve `imports` dizisine `ProductsModule`'ü ekleyin.

**Adım 8.2: Ürün DTO'su (Data Transfer Object) Oluşturma**

Yeni bir ürün oluştururken hangi verilerin gerekli olduğunu tanımlayan bir DTO dosyası oluşturalım.

  * `packages/atropos-api/src/products/` altında `dto` adında bir klasör ve içine `create-product.dto.ts` adında bir dosya oluşturun:
    ```typescript
    // packages/atropos-api/src/products/dto/create-product.dto.ts
    import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

    export class CreateProductDto {
      @IsString()
      @IsNotEmpty()
      name: string;

      @IsString()
      @IsNotEmpty()
      code: string; // SKU

      @IsNumber()
      @IsPositive()
      basePrice: number;

      // Bu alanları şimdilik elle göndereceğiz
      @IsString()
      @IsNotEmpty()
      categoryId: string;

      @IsString()
      @IsNotEmpty()
      taxId: string;
    }
    ```

**Adım 8.3: `ProductsService` İçinde Veritabanı Mantığını Yazma**

Veritabanından ürün okuma, ekleme ve silme işlemlerini yapacak olan servis mantığını yazalım.

  * `packages/atropos-api/src/products/products.service.ts` dosyasının içeriğini aşağıdaki kod ile güncelleyin:
    ```typescript
    // packages/atropos-api/src/products/products.service.ts
    import { Injectable } from '@nestjs/common';
    import { PrismaService } from '../prisma/prisma.service';
    import { CreateProductDto } from './dto/create-product.dto';

    @Injectable()
    export class ProductsService {
      constructor(private prisma: PrismaService) {}

      create(createProductDto: CreateProductDto, companyId: string) {
        return this.prisma.product.create({
          data: {
            ...createProductDto,
            companyId, // Ürünü şirkete bağla
          },
        });
      }

      findAll(companyId: string) {
        return this.prisma.product.findMany({
          where: { companyId },
          include: { category: true, tax: true } // İlişkili verileri de getir
        });
      }

      remove(id: string) {
        return this.prisma.product.delete({ where: { id } });
      }
    }
    ```

**Adım 8.4: `ProductsController` İçinde API Rotalarını Tanımlama**

Bu servis metotlarını dış dünyaya açacak olan API endpoint'lerini oluşturalım ve yetkilendirme ekleyelim.

  * `packages/atropos-api/src/products/products.controller.ts` dosyasının içeriğini aşağıdaki kod ile güncelleyin:
    ```typescript
    // packages/atropos-api/src/products/products.controller.ts
    import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, ValidationPipe } from '@nestjs/common';
    import { ProductsService } from './products.service';
    import { CreateProductDto } from './dto/create-product.dto';
    import { AuthGuard } from '@nestjs/passport';

    @UseGuards(AuthGuard('jwt')) // Bu controller'daki tüm endpoint'ler korumalı
    @Controller('products')
    export class ProductsController {
      constructor(private readonly productsService: ProductsService) {}

      @Post()
      create(@Body(new ValidationPipe()) createProductDto: CreateProductDto, @Request() req) {
        // req.user.companyId JWT'den gelecek (ileride eklenecek)
        // Şimdilik varsayılan bir companyId kullanacağız.
        const companyId = req.user.companyId || "clxzaevsc000008l9c1wb2d1g";
        return this.productsService.create(createProductDto, companyId);
      }

      @Get()
      findAll(@Request() req) {
        const companyId = req.user.companyId || "clxzaevsc000008l9c1wb2d1g";
        return this.productsService.findAll(companyId);
      }

      @Delete(':id')
      remove(@Param('id') id: string) {
        return this.productsService.remove(id);
      }
    }
    ```

-----

### **Bölüm 2: Frontend (`atropos-desktop`) - Ürün Yönetim Arayüzü**

**Adım 8.5: Ürünler Sayfasını Geliştirme**

Şimdi, oluşturduğumuz bu API'yi kullanarak ürünleri listeleyeceğimiz ve sileceğimiz arayüzü yapalım. Bunun için MUI'ın güçlü data grid bileşenini kullanacağız.

  * **Data Grid kütüphanesini yükleyin:** Projenin **ana dizinine** dönün (`cd ../..`) ve aşağıdaki komutu çalıştırın:
    ```bash
    pnpm --filter atropos-desktop add @mui/x-data-grid
    ```
  * `packages/atropos-desktop/src/renderer/src/pages/ProductsPage.tsx` dosyasının içeriğini aşağıdaki kod ile tamamen değiştirin:
    ```tsx
    // packages/atropos-desktop/src/renderer/src/pages/ProductsPage.tsx
    import { useState, useEffect } from 'react';
    import { Box, Button, Typography, IconButton } from '@mui/material';
    import { DataGrid, GridColDef } from '@mui/x-data-grid';
    import api from '../api';
    import DeleteIcon from '@mui/icons-material/Delete';
    import AddIcon from '@mui/icons-material/Add';

    export default function ProductsPage() {
      const [products, setProducts] = useState([]);
      const [loading, setLoading] = useState(true);

      const fetchProducts = async () => {
        setLoading(true);
        try {
          const response = await api.get('/products');
          setProducts(response.data);
        } catch (error) {
          console.error("Ürünler çekilirken hata oluştu:", error);
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => {
        fetchProducts();
      }, []);

      const handleDelete = async (id: string) => {
        if (window.confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
          try {
            await api.delete(`/products/${id}`);
            fetchProducts(); // Listeyi yenile
          } catch (error) {
            console.error("Ürün silinirken hata:", error);
          }
        }
      };

      const columns: GridColDef[] = [
        { field: 'name', headerName: 'Ürün Adı', width: 250 },
        { field: 'code', headerName: 'SKU', width: 150 },
        { field: 'basePrice', headerName: 'Fiyat', width: 130, type: 'number' },
        { 
          field: 'category', 
          headerName: 'Kategori', 
          width: 180,
          valueGetter: (params) => params.row.category?.name || 'N/A' 
        },
        { 
          field: 'tax', 
          headerName: 'Vergi', 
          width: 150,
          valueGetter: (params) => params.row.tax?.name || 'N/A' 
        },
        {
          field: 'actions',
          headerName: 'İşlemler',
          width: 100,
          sortable: false,
          renderCell: (params) => (
            <IconButton onClick={() => handleDelete(params.row.id)} color="error">
              <DeleteIcon />
            </IconButton>
          ),
        },
      ];

      return (
        <Box sx={{ height: '85vh', width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4">Ürün Yönetimi</Typography>
            <Button variant="contained" startIcon={<AddIcon />}>
              Yeni Ürün Ekle
            </Button>
          </Box>
          <DataGrid
            rows={products}
            columns={columns}
            loading={loading}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 25, 50]}
          />
        </Box>
      );
    }
    ```

**Adım 8.6: Test Etme**

1.  Backend'i (`pnpm dev:api`) ve Frontend'i (`pnpm dev:desktop`) çalıştırın.
2.  Uygulamaya giriş yapın ve sol menüden "Ürünler" sayfasına gidin.
3.  Başlangıçta tablonun boş olması normaldir.
4.  Şimdilik Postman gibi bir araçla `POST /products` endpoint'ine birkaç örnek ürün ekleyin. *(Bir sonraki adımda bunu arayüzden yapacağız.)*
5.  Ürünleri ekledikten sonra, Frontend uygulamasındaki tabloyu yenilediğinizde (veya sayfaya tekrar girdiğinizde) eklediğiniz ürünlerin listelendiğini göreceksiniz.
6.  Satır sonundaki çöp kutusu ikonuna basarak ürün silmeyi deneyin.

Bu adımların sonunda, uygulamanızın ilk tam entegre (full-stack) özelliğini tamamlamış olacaksınız. Bir sonraki görevimiz, "Yeni Ürün Ekle" butonuna basıldığında açılan bir form ile arayüzden ürün eklemeyi sağlamak olacak.