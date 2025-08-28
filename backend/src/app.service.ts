import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  // Veritabanı bağlantısını test etmek için basit bir fonksiyon
  async testDatabase() {
    try {
      // Tüm şirketleri say (henüz hiç şirket yok olacak)
      const companyCount = await this.prisma.company.count();
      return {
        status: 'success',
        message: 'Veritabanı bağlantısı başarılı!',
        companyCount,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Veritabanı bağlantı hatası',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}
