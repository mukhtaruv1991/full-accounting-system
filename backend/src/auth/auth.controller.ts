import { Controller, Post, Body, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

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
  async register(@Body() registerDto: any) {
    const { accountType, name, email, password, phone, companyName, companyAddress, companyPhone, companyIdToJoin } = registerDto;

    if (!accountType || !name || !email || !password || !phone) {
      throw new BadRequestException('Missing required fields for user registration.');
    }

    switch (accountType) {
      case 'admin':
        if (!companyName) {
          throw new BadRequestException('Company name is required for admin registration.');
        }
        return this.usersService.createAdminAndCompany({ name, email, password, phone }, { name: companyName, address: companyAddress, phone: companyPhone });
      
      case 'manager':
        if (!companyIdToJoin) {
          throw new BadRequestException('Company ID is required for manager registration.');
        }
        return this.usersService.createManagerRequest({ name, email, password, phone }, companyIdToJoin);

      case 'normal':
        return this.usersService.createNormalUser({ name, email, password, phone });

      default:
        throw new BadRequestException('Invalid account type specified.');
    }
  }
}
