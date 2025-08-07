import { Controller, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch(':id/assign-branch')
  assignBranch(@Param('id') id: string, @Body('branchId') branchId: string) {
    return this.usersService.assignBranch(id, branchId);
  }
}

