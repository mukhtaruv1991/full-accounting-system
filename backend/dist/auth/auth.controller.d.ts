import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Prisma } from '@prisma/client';
declare class RegisterDto implements Prisma.UserCreateInput {
    email: string;
    password: string;
    name: string;
    companyName: string;
}
export declare class AuthController {
    private authService;
    private usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(loginDto: any): Promise<{
        access_token: string;
    }>;
    register(registerDto: RegisterDto): Promise<{
        message: string;
    }>;
}
export {};
