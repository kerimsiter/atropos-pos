// packages/atropos-api/src/taxes/taxes.controller.ts
import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { TaxesService } from './taxes.service';
import { CreateTaxDto } from './dto/create-tax.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('taxes')
export class TaxesController {
  constructor(private readonly taxesService: TaxesService) {}

  @Post()
  create(@Body(new ValidationPipe()) createTaxDto: CreateTaxDto, @Request() req) {
    return this.taxesService.create(createTaxDto, req.user.companyId);
  }

  @Get()
  findAll(@Request() req) {
    return this.taxesService.findAll(req.user.companyId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taxesService.remove(id);
  }
}
