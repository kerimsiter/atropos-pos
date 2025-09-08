// backend/src/user/user.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt'; // Şifre hash'leme için

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Kullanıcı adı veya telefon numarası zaten var mı kontrol et
    const existingUserByUsername = await this.prisma.user.findUnique({
      where: { username: createUserDto.username },
    });
    if (existingUserByUsername) {
      throw new ConflictException('Bu kullanıcı adı zaten kullanımda.');
    }

    const existingUserByPhone = await this.prisma.user.findFirst({
      where: { phone: createUserDto.phone },
    });
    if (existingUserByPhone) {
      throw new ConflictException('Bu telefon numarası zaten kullanımda.');
    }
    
    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10); // 10 salt rounds

    // companyId ve branchId'yi data'dan çıkar çünkü Prisma relation'ları kullanıyoruz
    const { companyId, branchId, ...userData } = createUserDto;

    return this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        companyId: companyId || 'default-company-id', // Geçici olarak default company ID
        branchId: branchId || null,
      },
      select: { // Şifreyi döndürme
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        companyId: true,
        branchId: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      where: { deletedAt: null },
      select: { // Şifreyi döndürme
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        companyId: true,
        branchId: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      select: { // Şifreyi döndürme
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        companyId: true,
        branchId: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // Kullanıcının varlığını kontrol et

    // Şifre varsa hash'le
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Telefon numarası veya kullanıcı adı değişiyorsa benzersizlik kontrolü (kendi id'si hariç)
    if (updateUserDto.username) {
        const existingUser = await this.prisma.user.findFirst({
            where: { username: updateUserDto.username, id: { not: id } },
        });
        if (existingUser) {
            throw new ConflictException('Bu kullanıcı adı zaten kullanımda.');
        }
    }

    if (updateUserDto.phone) {
        const existingUser = await this.prisma.user.findFirst({
            where: { phone: updateUserDto.phone, id: { not: id } },
        });
        if (existingUser) {
            throw new ConflictException('Bu telefon numarası zaten kullanımda.');
        }
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: { // Şifreyi döndürme
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        companyId: true,
        branchId: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Kullanıcının varlığını kontrol et
    return this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
      select: { // Şifreyi döndürme
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        companyId: true,
        branchId: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }
}
