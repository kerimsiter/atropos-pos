import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async assignBranch(userId: string, branchId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { branchId: branchId },
    });
  }
}

