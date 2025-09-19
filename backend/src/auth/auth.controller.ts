import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Prisma } from '@prisma/client';

// Define a DTO for registration to include companyName
class RegisterDto implements Prisma.UserCreateInput {
  email: string;
  password: string;
  name: string;
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
    const { name, email, password, companyName } = registerDto;
    // We pass the companyName separately to the service
    const user = await this.usersService.create({ name, email, password }, companyName);
    // Do not log the user in automatically, let them log in after registering.
    return { message: 'Registration successful. Please log in.' };
  }
}
