// packages/atropos-api/src/table-areas/table-areas.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTableAreaDto } from './dto/create-table-area.dto';

@Injectable()
export class TableAreasService {
  constructor(private prisma: PrismaService) {}

  create(createTableAreaDto: CreateTableAreaDto, companyId: string, branchId: string) {
    return this.prisma.tableArea.create({
      data: {
        ...createTableAreaDto,
        companyId,
        branchId,
      },
    });
  }

  findAllByCompany(companyId: string) {
    return this.prisma.tableArea.findMany({
      where: { companyId },
    });
  }

  findAllByBranch(companyId: string, branchId: string) {
    return this.prisma.tableArea.findMany({
      where: { companyId, branchId },
    });
  }

  remove(id: string) {
    return this.prisma.tableArea.delete({ where: { id } });
  }
}
