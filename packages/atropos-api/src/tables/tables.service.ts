import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTablePositionDto } from './dto/update-table-position.dto';

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) {}

  create(createTableDto: CreateTableDto, branchId: string) {
    return this.prisma.table.create({
      data: {
        ...createTableDto,
        branchId,
      },
    });
  }

  findAllByBranch(branchId: string) {
    return this.prisma.table.findMany({
      where: { branchId },
      orderBy: { number: 'asc' },
    });
  }

  updatePosition(id: string, updateTablePositionDto: UpdateTablePositionDto) {
    return this.prisma.table.update({
      where: { id },
      data: {
        positionX: updateTablePositionDto.positionX,
        positionY: updateTablePositionDto.positionY,
      },
    });
  }

  remove(id: string) {
    return this.prisma.table.delete({
      where: { id },
    });
  }
}

