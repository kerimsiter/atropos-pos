// backend/src/company/company.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  // Yeni bir şirket oluştur
  async create(createCompanyDto: CreateCompanyDto) {
    return this.prisma.company.create({
      data: createCompanyDto,
    });
  }

  // Tüm şirketleri listele
  async findAll() {
    return this.prisma.company.findMany({
      where: { deletedAt: null }, // Sadece silinmemiş olanları getir
    });
  }

  // ID'ye göre tek bir şirket bul
  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id, deletedAt: null },
    });
    if (!company) {
      throw new NotFoundException(`Company with ID "${id}" not found`);
    }
    return company;
  }

  // Bir şirketi güncelle
  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    // Önce şirketin var olup olmadığını kontrol et
    await this.findOne(id);
    return this.prisma.company.update({
      where: { id },
      data: updateCompanyDto,
    });
  }

  // Bir şirketi sil (soft delete)
  async remove(id: string) {
    // Önce şirketin var olup olmadığını kontrol et
    await this.findOne(id);
    return this.prisma.company.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
