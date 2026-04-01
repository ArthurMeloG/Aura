import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  afterInit() {
    console.log('WebSocket gateway initialized');
  }

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token;
      if (token) {
        const payload = this.jwtService.verify(token, { secret: this.config.get('JWT_SECRET') });
        client.data.user = payload;
      }
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_conversation')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() data: { conversationId: string }) {
    client.join(`conv_${data.conversationId}`);
    return { event: 'joined', data: data.conversationId };
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; content: string },
  ) {
    const user = client.data.user;
    if (!user) return;

    const result = await this.chatService.sendMessage(data.conversationId, user.sub, data.content);

    // Emit user's message to room
    this.server.to(`conv_${data.conversationId}`).emit('new_message', {
      senderId: user.sub,
      content: data.content,
      isBot: false,
      createdAt: new Date(),
    });

    // Emit bot/system message if any
    if (result.message) {
      this.server.to(`conv_${data.conversationId}`).emit('new_message', result.message);
    }

    // Notify collaborators on escalation
    if (result.status === 'escalated') {
      this.server.emit('queue_updated');
    }

    return result;
  }

  @SubscribeMessage('claim_conversation')
  async handleClaim(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    const user = client.data.user;
    if (!user) return;

    const conv = await this.chatService.claimConversation(data.conversationId, user.sub);
    client.join(`conv_${data.conversationId}`);

    this.server.to(`conv_${data.conversationId}`).emit('conversation_updated', conv);
    this.server.emit('queue_updated');

    return conv;
  }
}
