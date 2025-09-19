import { JournalEntriesService } from './journal-entries.service';
import { Prisma } from '@prisma/client';
export declare class JournalEntriesController {
    private readonly journalEntriesService;
    constructor(journalEntriesService: JournalEntriesService);
    create(createJournalEntryDto: Prisma.JournalEntryCreateInput): Promise<any>;
}
