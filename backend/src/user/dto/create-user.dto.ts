// backend/src/user/dto/create-user.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsEnum,
  MinLength,
} from 'class-validator';
import { UserRole } from '@prisma/client'; // Prisma enum'u

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Kullanıcı adı boş bırakılamaz.' })
  username: string; // Örneğin, e-posta veya ayrı bir kullanıcı adı

  @IsString()
  @IsNotEmpty({ message: 'Şifre boş bırakılamaz.' })
  @MinLength(6, { message: 'Şifre en az 6 karakter olmalıdır.' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Ad boş bırakılamaz.' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Soyad boş bırakılamaz.' })
  lastName: string;

  @IsEmail({}, { message: 'Geçersiz e-posta adresi.' })
  @IsNotEmpty({ message: 'E-posta adresi boş bırakılamaz.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Telefon numarası boş bırakılamaz.' })
  phone: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsEnum(UserRole, { message: 'Geçersiz kullanıcı rolü.' })
  @IsNotEmpty({ message: 'Kullanıcı rolü boş bırakılamaz.' })
  role: UserRole; // Örneğin, ilk kayıt olan "ADMIN" olabilir

  @IsOptional() // İlk şirket kaydı yapılırken şirket ID'si olmayabilir
  @IsString()
  companyId?: string; 

  @IsOptional() // Şube yöneticisi veya altında bir rol için gerekli olabilir
  @IsString()
  branchId?: string;
}
