import { Controller, Post, Body, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

class RegisterDto {
  email: string;
  password: string;
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
    // The login service will now handle the multi-company logic
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const { email, password, companyName } = registerDto;
    if (!email || !password || !companyName) {
      throw new BadRequestException('Email, password, and company name are required.');
    }
    // The create service now handles creating the user, company, and membership
    await this.usersService.create({ email, password, companyName });
    return { message: 'Registration successful. Please log in.' };
  }
}
