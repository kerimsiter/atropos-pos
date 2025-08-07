import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, ValidationPipe, Patch } from '@nestjs/common';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTablePositionDto } from './dto/update-table-position.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  create(@Body(new ValidationPipe()) createTableDto: CreateTableDto, @Request() req) {
    // Masalar kullanıcının branchId'sine göre oluşturulur
    const { branchId } = req.user;
    return this.tablesService.create(createTableDto, branchId);
  }

  @Get()
  findAll(@Request() req) {
    const { branchId } = req.user;
    return this.tablesService.findAllByBranch(branchId);
  }

  @Patch(':id/position')
  updatePosition(@Param('id') id: string, @Body(new ValidationPipe()) updateTablePositionDto: UpdateTablePositionDto) {
    return this.tablesService.updatePosition(id, updateTablePositionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tablesService.remove(id);
  }
}

