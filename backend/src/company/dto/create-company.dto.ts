// backend/src/company/dto/create-company.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  taxNumber: string;

  @IsString()
  @IsNotEmpty()
  taxOffice: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  logo?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  website?: string;
}
