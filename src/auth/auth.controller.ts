import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from './auth.guard';
import { registerDto } from './dtos/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  register(@Body() registerDto: registerDto) {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Res() res) {
    // Seulement si le token est stocké dans un cookie, sinon gestion uniquement côté front.
    // Pour un logout plus avancée, regarder du coté des "listes de révocation". 
    res.clearCookie('jwt'); 
    return { message: 'Logout successful' };
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
