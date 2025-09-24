import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service'; // ✅ استيراد الخدمة

@Module({
  providers: [NotificationsService, NotificationsGateway], // ✅ تسجيل الخدمة
  exports: [NotificationsService, NotificationsGateway],   // ✅ تصدير الخدمة لتتمكن SalesModule من استخدامها
})
export class NotificationsModule {}
