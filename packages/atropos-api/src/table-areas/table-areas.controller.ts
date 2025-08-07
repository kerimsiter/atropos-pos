// packages/atropos-api/src/table-areas/table-areas.controller.ts
import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, ValidationPipe, UnauthorizedException } from '@nestjs/common';
import { TableAreasService } from './table-areas.service';
import { CreateTableAreaDto } from './dto/create-table-area.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('table-areas')
export class TableAreasController {
  constructor(private readonly tableAreasService: TableAreasService) {}

  @Post()
  create(@Body(new ValidationPipe()) createTableAreaDto: CreateTableAreaDto, @Request() req) {
    const { companyId, branchId } = req.user;
    if (!branchId) {
        throw new UnauthorizedException('Kullanıcının bir şubesi bulunmalıdır.');
    }
    return this.tableAreasService.create(createTableAreaDto, companyId, branchId);
  }

  @Get()
  findAll(@Request() req) {
    const { companyId, branchId } = req.user;
    if (!branchId) {
        return this.tableAreasService.findAllByCompany(companyId);
    }
    return this.tableAreasService.findAllByBranch(companyId, branchId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tableAreasService.remove(id);
  }
}
