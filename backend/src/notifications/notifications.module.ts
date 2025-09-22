import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsController } from './notifications.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [NotificationsService, NotificationsGateway, PrismaService],
  controllers: [NotificationsController],
  exports: [NotificationsService], // Export service to be used by other modules
})
export class NotificationsModule {}
