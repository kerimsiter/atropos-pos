import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBranchDto } from './dto/create-branch.dto';

@Injectable()
export class BranchesService {
  constructor(private prisma: PrismaService) {}

  create(createBranchDto: CreateBranchDto, companyId: string) {
    return this.prisma.branch.create({
      data: {
        ...createBranchDto,
        companyId,
      },
    });
  }

  findAllByCompany(companyId: string) {
    return this.prisma.branch.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  remove(id: string) {
    return this.prisma.branch.delete({
      where: { id },
    });
  }
}

