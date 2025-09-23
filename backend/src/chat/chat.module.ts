import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module'; // لاستخدامه في الحماية لاحقًا

@Module({
  imports: [AuthModule], // استيراد AuthModule للوصول إلى خدمات المصادقة
  providers: [ChatGateway, ChatService, PrismaService],
  controllers: [ChatController],
})
export class ChatModule {}
