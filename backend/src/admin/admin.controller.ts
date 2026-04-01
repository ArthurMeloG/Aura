import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('metrics')
  getMetrics() {
    return this.adminService.getMetrics();
  }

  @Get('faq')
  getFaq() {
    return this.adminService.getFaqEntries();
  }

  @Post('faq')
  createFaq(@Body() body: { question: string; answer: string; keywords: string[]; category?: string }) {
    return this.adminService.createFaqEntry(body);
  }

  @Delete('faq/:id')
  deleteFaq(@Param('id') id: string) {
    return this.adminService.deleteFaqEntry(id);
  }
}
