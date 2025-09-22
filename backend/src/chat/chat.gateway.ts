import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Logger } from '@nestjs/common';

interface ChatPayload {
  conversationId: string;
  content: string;
  type: 'text' | 'image' | 'audio';
}

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() conversationId: string,
  ): void {
    client.join(conversationId);
    this.logger.log(`Client ${client.id} joined room: ${conversationId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: ChatPayload,
  ): Promise<void> {
    // TODO: استخلاص هوية المستخدم الحقيقية من الـ token
    const senderId = 'temp-user-id'; 

    const savedMessage = await this.chatService.createMessage(
      senderId,
      payload.conversationId,
      payload.content,
      payload.type,
    );

    // بث الرسالة المحفوظة إلى جميع المشاركين في الغرفة
    this.server.to(payload.conversationId).emit('receiveMessage', savedMessage);
    
    this.logger.log(`Message from ${senderId} sent to room ${payload.conversationId}`);
  }
}
