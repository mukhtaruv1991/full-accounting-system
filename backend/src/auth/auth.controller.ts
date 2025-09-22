import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Prisma } from '@prisma/client';

class RegisterDto {
  email: string;
  password: string;
  name: string; // This property is kept for the DTO, but not passed to the service
  companyName: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: any) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const { email, password, companyName } = registerDto;
    // The 'name' property is no longer passed to the create method
    const user = await this.usersService.create({ email, password }, companyName);
    return { message: 'Registration successful. Please log in.' };
  }
}
