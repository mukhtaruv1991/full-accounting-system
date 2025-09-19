import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class JournalEntriesService {
  constructor(
    private prisma: PrismaService,
    private notificationsGateway: NotificationsGateway
  ) {}

  async create(data: Prisma.JournalEntryCreateInput) {
    const journalEntry = await this.prisma.journalEntry.create({ data });

    const notificationMessage = `تم إضافة قيد جديد بقيمة ${journalEntry.debitAmount} على حساب ${journalEntry.debitAccountId}.`;
    this.notificationsGateway.server.emit('newJournalEntry', notificationMessage);

    return journalEntry;
  }
}
