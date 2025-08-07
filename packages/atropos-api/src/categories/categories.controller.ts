// packages/atropos-api/src/categories/categories.controller.ts
import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

        @Post()
      create(@Body(new ValidationPipe()) createCategoryDto: CreateCategoryDto, @Request() req) {
        const companyId = req.user.companyId; // Doğrudan JWT'den gelen companyId
        return this.categoriesService.create(createCategoryDto, companyId);
      }

      @Get()
      findAll(@Request() req) {
        const companyId = req.user.companyId; // Doğrudan JWT'den gelen companyId
        return this.categoriesService.findAll(companyId);
      }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}

