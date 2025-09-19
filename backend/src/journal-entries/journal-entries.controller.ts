import { Controller, Post, Body } from '@nestjs/common';
import { JournalEntriesService } from './journal-entries.service';
import { Prisma } from '@prisma/client';

@Controller('journal-entries')
export class JournalEntriesController {
  constructor(private readonly journalEntriesService: JournalEntriesService) {}

  @Post()
  create(@Body() createJournalEntryDto: Prisma.JournalEntryCreateInput) {
    return this.journalEntriesService.create(createJournalEntryDto);
  }
}
