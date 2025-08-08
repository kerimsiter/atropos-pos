import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  create(@Body() dto: CreateRecipeDto) {
    // TEMP DEBUG: Trace incoming create requests
    // Do not log full payload to avoid noise; only essentials
    // eslint-disable-next-line no-console
    console.info('[RecipesController] POST /recipes', {
      productId: dto.productId,
      items: dto.items?.length ?? 0,
    });
    return this.recipesService.create(dto);
  }

  @Get('by-product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.recipesService.findByProduct(productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRecipeDto) {
    return this.recipesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recipesService.remove(id);
  }
}
