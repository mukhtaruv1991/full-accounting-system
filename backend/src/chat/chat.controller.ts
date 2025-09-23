import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  async getConversations(@CurrentUser() user: User) {
    return this.chatService.getConversationsForUser(user.id);
  }

  @Get('conversations/:conversationId/messages')
  async getMessages(@Param('conversationId') conversationId: string) {
    return this.chatService.getMessages(conversationId);
  }

  @Post('conversations/find-or-create')
  async findOrCreateConversation(@CurrentUser() user: User, @Body('otherUserId') otherUserId: string) {
    return this.chatService.findOrCreateConversation(user.id, otherUserId);
  }
}
