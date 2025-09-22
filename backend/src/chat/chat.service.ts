import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  // دالة لإنشاء رسالة جديدة وحفظها في قاعدة البيانات
  async createMessage(senderId: string, conversationId: string, content: string, type: 'text' | 'image' | 'audio') {
    const message = await this.prisma.message.create({
      data: {
        content,
        type,
        senderId,
        conversationId,
      },
      include: {
        sender: {
          select: { id: true, name: true },
        },
      },
    });

    // إنشاء حالة قراءة للمرسل (يعتبر أنه قرأ رسالته)
    await this.prisma.messageReadStatus.create({
      data: {
        messageId: message.id,
        userId: senderId,
        readAt: new Date(),
      },
    });

    return message;
  }

  // دالة لجلب الرسائل السابقة في محادثة
  async getMessages(conversationId: string) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: { id: true, name: true },
        },
      },
    });
  }
}
