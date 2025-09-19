import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { JournalEntriesService } from './journal-entries.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('journal-entries')
export class JournalEntriesController {
  constructor(private readonly journalEntriesService: JournalEntriesService) {}

  @Post()
  create(@Body() createJournalEntryDto: Prisma.JournalEntryCreateInput, @CurrentUser() user: any) {
    return this.journalEntriesService.create({ ...createJournalEntryDto, companyId: user.companyId });
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.journalEntriesService.findAll(user.companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.journalEntriesService.findOne(id, user.companyId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateJournalEntryDto: Prisma.JournalEntryUpdateInput, @CurrentUser() user: any) {
    return this.journalEntriesService.update(id, updateJournalEntryDto, user.companyId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.journalEntriesService.remove(id, user.companyId);
  }
}
