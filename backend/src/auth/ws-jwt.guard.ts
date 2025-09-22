import { CanActivate, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { PrismaService } from '../prisma.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtGuard.name);

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: any): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const token = this.extractTokenFromHandshake(client);

    if (!token) {
      this.logger.warn('No token provided, disconnecting client.');
      this.disconnect(client, 'No token provided.');
      return false;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      
      // البحث عن المستخدم في قاعدة البيانات للتأكد من وجوده
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) {
        this.logger.warn(`User with ID ${payload.sub} not found.`);
        this.disconnect(client, 'User not found.');
        return false;
      }
      
      // إرفاق بيانات المستخدم بالـ socket للوصول إليها لاحقًا
      client.data.user = user;

    } catch (error) {
      this.logger.error('Token validation failed', error.message);
      this.disconnect(client, 'Token validation failed.');
      return false;
    }

    return true;
  }

  private extractTokenFromHandshake(client: Socket): string | null {
    const authHeader = client.handshake.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
    return null;
  }

  private disconnect(client: Socket, message: string) {
    client.emit('error', new WsException(message));
    client.disconnect();
  }
}
