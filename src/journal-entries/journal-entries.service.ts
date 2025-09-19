import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, JournalEntry } from '@prisma/client';

@Injectable()
export class JournalEntriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.JournalEntryCreateInput): Promise<JournalEntry> {
    return this.prisma.journalEntry.create({ data });
  }

  async findAll(companyId: string): Promise<JournalEntry[]> {
    return this.prisma.journalEntry.findMany({ where: { companyId } });
  }

  async findOne(id: string, companyId: string): Promise<JournalEntry | null> {
    const entry = await this.prisma.journalEntry.findUnique({
      where: { id },
    });
    if (!entry || entry.companyId !== companyId) {
      throw new NotFoundException(`Journal entry with ID ${id} not found for this company.`);
    }
    return entry;
  }

  async update(id: string, data: Prisma.JournalEntryUpdateInput, companyId: string): Promise<JournalEntry> {
    const existingEntry = await this.prisma.journalEntry.findUnique({ where: { id } });
    if (!existingEntry || existingEntry.companyId !== companyId) {
      throw new NotFoundException(`Journal entry with ID ${id} not found for this company.`);
    }
    return this.prisma.journalEntry.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, companyId: string): Promise<JournalEntry> {
    const existingEntry = await this.prisma.journalEntry.findUnique({ where: { id } });
    if (!existingEntry || existingEntry.companyId !== companyId) {
      throw new NotFoundException(`Journal entry with ID ${id} not found for this company.`);
    }
    return this.prisma.journalEntry.delete({ where: { id } });
  }
}
