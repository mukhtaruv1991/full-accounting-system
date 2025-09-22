import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module'; // لاستخدامه في الحماية لاحقًا

@Module({
  imports: [AuthModule], // استيراد AuthModule للوصول إلى خدمات المصادقة
  providers: [ChatGateway, ChatService, PrismaService],
})
export class ChatModule {}
