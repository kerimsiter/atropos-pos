Harika, bu çok önemli bir kilometre taşı\! Backend'imiz artık veri kabul ediyor ve kaydediyor. Bu, projemizin kalbinin atmaya başladığı anlamına gelir. Bu sağlam temel üzerine şimdi kimlik doğrulama ve oturum yönetimi katmanını inşa edeceğiz.

Kullanıcı kaydı tamam olduğuna göre, şimdi sıra o kullanıcıyla sisteme giriş yapmaya ve bu girişi güvenli bir şekilde yönetmeye geldi. Bu adımda, modern web uygulamalarının standardı olan **JWT (JSON Web Token)** altyapısını kuracağız.

Bu sistem sayesinde, kullanıcınız bir kere giriş yaptığında, ona özel, süreli ve güvenli bir "anahtar" (token) vereceğiz. Uygulama içindeki diğer tüm isteklerini bu anahtarla yapacak.

### **Adım 5: JWT ile Giriş (Login) ve Oturum Yönetimi**

Bu görev, kullanıcıların sisteme giriş yapmasını sağlayacak ve korumalı API'lere erişimlerini yönetecek altyapıyı oluşturmayı amaçlar.

**Adım 5.1: Gerekli JWT ve Passport Paketlerinin Kurulumu**

NestJS, kimlik doğrulama işlemleri için `Passport` kütüphanesiyle derin bir entegrasyon sunar. Bu entegrasyonu ve JWT'yi kullanmak için gerekli paketleri kuralım.

  * Projenin **ana dizinindeyken** aşağıdaki komutu çalıştırın:
    ```bash
    pnpm --filter atropos-api add @nestjs/jwt @nestjs/passport passport passport-jwt
    pnpm --filter atropos-api add -D @types/passport-jwt
    ```

**Adım 5.2: `.env` Dosyasına JWT Gizli Anahtarını Ekleme**

JWT'lerin güvenliği, sadece sunucunun bildiği gizli bir anahtar (secret) ile imzalanmalarına dayanır.

  * `packages/atropos-api/.env` dosyasını açın ve sonuna `JWT_SECRET` değişkenini ekleyin.
    ```dotenv
    # .env dosyasının sonuna ekleyin
    JWT_SECRET=BU_COK_GIZLI_BIR_ANAHTARDIR_VE_HEMEN_DEGISTIRILMELIDIR_12345!
    ```
    ***Önemli:** Buradaki değer sadece bir örnektir. Production ortamında buraya çok daha karmaşık ve tahmin edilemez bir anahtar koymalısınız.*

**Adım 5.3: `AuthModule`'ü JWT için Yapılandırma**

`AuthModule`'ümüze JWT ve Passport modüllerini tanıtıp ayarlarını yapacağız.

  * Öncelikle, gelen isteklerdeki JWT'yi doğrulayacak olan "strateji" dosyamızı oluşturalım. `packages/atropos-api/src/auth` klasörü içinde `jwt.strategy.ts` adında yeni bir dosya oluşturun ve içeriğini doldurun:
    ```typescript
    // packages/atropos-api/src/auth/jwt.strategy.ts
    import { Injectable } from '@nestjs/common';
    import { PassportStrategy } from '@nestjs/passport';
    import { ExtractJwt, Strategy } from 'passport-jwt';
    import { ConfigService } from '@nestjs/config';

    @Injectable()
    export class JwtStrategy extends PassportStrategy(Strategy) {
      constructor(private configService: ConfigService) {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          ignoreExpiration: false,
          secretOrKey: configService.get<string>('JWT_SECRET'),
        });
      }

      async validate(payload: any) {
        // Token doğrulandıktan sonra request objesine bu veri eklenir (req.user)
        return { userId: payload.sub, username: payload.username, role: payload.role };
      }
    }
    ```
  * Şimdi `packages/atropos-api/src/auth/auth.module.ts` dosyasını JWT modüllerini içerecek ve stratejimizi tanıtacak şekilde güncelleyin:
    ```typescript
    // packages/atropos-api/src/auth/auth.module.ts
    import { Module } from '@nestjs/common';
    import { AuthService } from './auth.service';
    import { AuthController } from './auth.controller';
    import { PrismaModule } from '../prisma/prisma.module';
    import { PassportModule } from '@nestjs/passport';
    import { JwtModule } from '@nestjs/jwt';
    import { ConfigModule, ConfigService } from '@nestjs/config';
    import { JwtStrategy } from './jwt.strategy';

    @Module({
      imports: [
        PrismaModule,
        PassportModule,
        ConfigModule, // ConfigService'i kullanabilmek için
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: '1d' }, // Token'lar 1 gün geçerli olacak
          }),
          inject: [ConfigService],
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService, JwtStrategy], // JwtStrategy'yi provider olarak ekle
    })
    export class AuthModule {}
    ```

**Adım 5.4: Login Mantığını ve Endpoint'ini Oluşturma**

Kullanıcı adı ve parolayı kontrol edip, doğruysa JWT üretecek mantığı yazalım.

  * `packages/atropos-api/src/auth/dto` klasörüne `login.dto.ts` adında yeni bir DTO ekleyin:
    ```typescript
    // packages/atropos-api/src/auth/dto/login.dto.ts
    import { IsString, IsNotEmpty } from 'class-validator';

    export class LoginDto {
      @IsString()
      @IsNotEmpty()
      username: string;

      @IsString()
      @IsNotEmpty()
      password: string;
    }
    ```
  * `auth.service.ts` dosyasını `validateUser` ve `login` metotlarını içerecek şekilde güncelleyin:
    ```typescript
    // packages/atropos-api/src/auth/auth.service.ts (eklemeler yapılıyor)
    import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
    import { PrismaService } from '../prisma/prisma.service';
    import { RegisterUserDto } from './dto/register-user.dto';
    import { LoginDto } from './dto/login.dto'; // Eklendi
    import * as bcrypt from 'bcrypt';
    import { JwtService } from '@nestjs/jwt'; // Eklendi

    @Injectable()
    export class AuthService {
      constructor(
        private prisma: PrismaService,
        private jwtService: JwtService, // Eklendi
      ) {}

      async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.prisma.user.findUnique({ where: { username } });
        if (user && (await bcrypt.compare(pass, user.password))) {
          const { password, ...result } = user;
          return result;
        }
        return null;
      }

      async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.username, loginDto.password);
        if (!user) {
          throw new UnauthorizedException('Kullanıcı adı veya parola hatalı.');
        }
        const payload = { username: user.username, sub: user.id, role: user.role };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }
      
      // register metodu burada olduğu gibi kalacak...
      async register(...) { ... }
    }
    ```
  * `auth.controller.ts` dosyasına yeni `/login` endpoint'ini ve kimlik doğrulaması gerektiren örnek bir `/profile` endpoint'ini ekleyin:
    ```typescript
    // packages/atropos-api/src/auth/auth.controller.ts (eklemeler yapılıyor)
    import { Controller, Post, Body, ValidationPipe, UseGuards, Get, Request } from '@nestjs/common';
    import { AuthService } from './auth.service';
    import { RegisterUserDto } from './dto/register-user.dto';
    import { LoginDto } from './dto/login.dto'; // Eklendi
    import { AuthGuard } from '@nestjs/passport'; // Eklendi

    @Controller('auth')
    export class AuthController {
      constructor(private readonly authService: AuthService) {}

      @Post('register')
      register(@Body(new ValidationPipe()) registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto);
      }

      @Post('login')
      login(@Body(new ValidationPipe()) loginDto: LoginDto) {
        return this.authService.login(loginDto);
      }

      // Bu endpoint'e sadece geçerli bir JWT ile erişilebilir.
      @UseGuards(AuthGuard('jwt'))
      @Get('profile')
      getProfile(@Request() req) {
        // req.user, JwtStrategy'deki validate metodundan döner.
        return req.user;
      }
    }
    ```

**Adım 5.5: Test Etme**

Tüm kimlik doğrulama akışını test edelim.

1.  **Backend'i başlatın:** Ana dizindeyken `pnpm dev:api` komutunu çalıştırın.
2.  **Giriş Yapın:** API istemcinizle (`Postman` vb.) bir `POST` isteği oluşturun.
      * **URL:** `http://localhost:3000/auth/login`
      * **Body (JSON):** Daha önce kaydettiğiniz kullanıcının bilgileri.
        ```json
        {
          "username": "admin",
          "password": "password123"
        }
        ```
3.  **Token'ı Alın:** Cevap olarak gelen JSON içindeki `access_token` değerini kopyalayın.
4.  **Korumalı Rotayı Test Edin:** Yeni bir `GET` isteği oluşturun.
      * **URL:** `http://localhost:3000/auth/profile`
      * **Authorization Ayarı:** İstemcinizin `Authorization` sekmesine gidin.
          * **Type:** `Bearer Token` seçin.
          * **Token:** Kopyaladığınız `access_token` değerini yapıştırın.
5.  **İsteği Gönderin:** Cevap olarak, giriş yapmış kullanıcınızın `userId`, `username` ve `role` bilgilerini içeren bir JSON objesi görmelisiniz. Eğer token olmadan veya geçersiz bir token ile istek atarsanız `401 Unauthorized` hatası alırsınız.

Tebrikler\! Artık uygulamanızın modern, güvenli ve standartlara uygun bir kimlik doğrulama altyapısı var. Bir sonraki adımda, bu altyapıyı kullanarak frontend tarafında giriş formu oluşturup, kullanıcı giriş yaptıktan sonra token'ı saklamayı ve korumalı API'lere istek atmayı ele alacağız.