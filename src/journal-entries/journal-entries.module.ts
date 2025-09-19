import { Module } from '@nestjs/common';
import { JournalEntriesService } from './journal-entries.service';
import { JournalEntriesController } from './journal-entries.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [JournalEntriesService, PrismaService],
  controllers: [JournalEntriesController],
  exports: [JournalEntriesService],
})
export class JournalEntriesModule {}
