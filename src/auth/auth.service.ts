import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { username, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user || !(await user.comparePassword(password))) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles,
    };
    const access_token = await this.jwtService.signAsync(payload);

    return { access_token };
  }

  async register(registerDto: RegisterDto): Promise<any> {
    const { username, email } = registerDto;

    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });
    if (existingUser) {
      throw new ConflictException('Email or username already in use.');
    }

    const user = await this.userService.create(registerDto);
    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles,
    };
    const access_token = await this.jwtService.signAsync(payload);

    const { password, ...userWithoutPassword } = user;
    return {
      message: 'User registered successfully.',
      data: {
        user: userWithoutPassword,
        access_token,
      },
    };
  }
}
