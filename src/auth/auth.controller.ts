import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login user',
  })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({
    summary: 'Register user and login automatically',
  })
  @HttpCode(HttpStatus.OK)
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({
    summary: 'Logout user',
  })
  @Post('logout')
  logout(@Res() res) {
    // Seulement si le token est stocké dans un cookie, sinon gestion uniquement côté front.
    // Pour un logout plus avancée, regarder du coté des "listes de révocation".
    res.clearCookie('jwt');
    return res.status(HttpStatus.OK).send({ message: 'Logout successful' });
  }
}
