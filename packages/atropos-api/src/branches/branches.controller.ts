import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  create(@Body(new ValidationPipe()) createBranchDto: CreateBranchDto, @Request() req) {
    const { companyId } = req.user;
    return this.branchesService.create(createBranchDto, companyId);
  }

  @Get()
  findAll(@Request() req) {
    const { companyId } = req.user;
    return this.branchesService.findAllByCompany(companyId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.branchesService.remove(id);
  }
}

