import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module'; // التأكد من استيراد UsersModule
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { WsJwtGuard } from './ws-jwt.guard';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma.service';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    UsersModule, // UsersModule مطلوب هنا ليتمكن AuthController من استخدام UsersService
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, WsJwtGuard, PrismaService],
  exports: [AuthService, WsJwtGuard],
})
export class AuthModule {}
