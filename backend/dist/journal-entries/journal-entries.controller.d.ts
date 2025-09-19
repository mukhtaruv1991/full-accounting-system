import { JournalEntriesService } from './journal-entries.service';
import { Prisma } from '@prisma/client';
export declare class JournalEntriesController {
    private readonly journalEntriesService;
    constructor(journalEntriesService: JournalEntriesService);
    create(createJournalEntryDto: Prisma.JournalEntryCreateInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        date: Date;
        description: string;
        debitAmount: number;
        creditAmount: number;
        debitAccountId: string;
        creditAccountId: string;
    }>;
}
