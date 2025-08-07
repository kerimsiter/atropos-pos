// packages/atropos-api/src/products/products.controller.ts
import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt')) // Bu controller'daki tüm endpoint'ler korumalı
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body(new ValidationPipe()) createProductDto: CreateProductDto, @Request() req) {
    // req.user.companyId JWT'den gelecek (ileride eklenecek)
    // Şimdilik varsayılan bir companyId kullanacağız.
    const companyId = req.user.companyId || "clxzaevsc000008l9c1wb2d1g";
    return this.productsService.create(createProductDto, companyId);
  }

  @Get()
  findAll(@Request() req) {
    const companyId = req.user.companyId || "clxzaevsc000008l9c1wb2d1g";
    return this.productsService.findAll(companyId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
