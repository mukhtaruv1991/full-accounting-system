import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { JournalEntriesController } from './journal-entries.controller';
import { JournalEntriesService } from './journal-entries.service';
import { PrismaService } from '../prisma.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
    NotificationsModule,
  controllers: [JournalEntriesController],
  providers: [JournalEntriesService, PrismaService],
})
export class JournalEntriesModule {}
