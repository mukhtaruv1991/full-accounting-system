import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { NotificationsModule } from '../notifications/notifications.module'; // ✅ استيراد الموديول

@Module({
  imports: [NotificationsModule], // ✅ ضروري حتى يستطيع NestJS حقن NotificationsService
  providers: [SalesService],
  controllers: [SalesController],
})
export class SalesModule {} 
