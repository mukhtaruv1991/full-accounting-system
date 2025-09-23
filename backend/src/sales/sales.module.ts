import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module'; // This line is the fix

@Module({
  imports: [PrismaModule, NotificationsModule], // And this line is the fix
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
