import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createMessage(senderId: string, conversationId: string, content: string, type: 'text' | 'image' | 'audio') {
    const message = await this.prisma.message.create({
      data: {
        content,
        type,
        senderId,
        conversationId,
      },
      include: {
        sender: { select: { id: true, name: true, email: true } },
      },
    });
    return message;
  }

  async getMessages(conversationId: string) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findOrCreateConversation(userId1: string, userId2: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        AND: [
          { members: { some: { id: userId1 } } },
          { members: { some: { id: userId2 } } },
        ],
      },
    });

    if (conversation) {
      return conversation;
    }

    return this.prisma.conversation.create({
      data: {
        members: {
          connect: [{ id: userId1 }, { id: userId2 }],
        },
      },
    });
  }

  async getConversationsForUser(userId: string) {
    return this.prisma.conversation.findMany({
      where: { members: { some: { id: userId } } },
      include: {
        members: {
          where: { NOT: { id: userId } },
          select: { id: true, name: true, email: true },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
  }
}
