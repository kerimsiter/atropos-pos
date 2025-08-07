// packages/atropos-api/src/auth/auth.controller.ts (eklemeler yapılıyor)
import { Controller, Post, Body, ValidationPipe, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto'; // Eklendi
import { AuthGuard } from '@nestjs/passport'; // Eklendi

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body(new ValidationPipe()) registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  login(@Body(new ValidationPipe()) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // Bu endpoint'e sadece geçerli bir JWT ile erişilebilir.
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    // req.user, JwtStrategy'deki validate metodundan döner.
    return req.user;
  }
}
