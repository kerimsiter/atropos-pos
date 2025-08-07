import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateTableDto {
  @IsString()
  @IsNotEmpty()
  number: string;

  @IsNumber()
  @IsPositive()
  capacity: number;

  @IsString()
  @IsNotEmpty()
  areaId: string;
}

