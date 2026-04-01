import { Controller, Get, Post, Param, Body, UseGuards, Patch } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get()
  getConversations(@CurrentUser() user: any) {
    return this.chatService.getConversations(user.id);
  }

  @Post('start')
  start(@CurrentUser() user: any) {
    return this.chatService.startConversation(user.id);
  }

  @Get('queue')
  @UseGuards(RolesGuard)
  @Roles('COLLABORATOR', 'ADMIN')
  getQueue() {
    return this.chatService.getQueue();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.chatService.getConversation(id);
  }

  @Patch(':id/close')
  close(@Param('id') id: string) {
    return this.chatService.closeConversation(id);
  }
}
