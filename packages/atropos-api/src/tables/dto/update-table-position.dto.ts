import { IsNumber, IsOptional } from 'class-validator';

export class UpdateTablePositionDto {
  @IsNumber()
  @IsOptional()
  positionX?: number;

  @IsNumber()
  @IsOptional()
  positionY?: number;
}

