import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { NotificationsGateway } from '../notifications/notifications.gateway';
export declare class JournalEntriesService {
    private prisma;
    private notificationsGateway;
    constructor(prisma: PrismaService, notificationsGateway: NotificationsGateway);
    create(data: Prisma.JournalEntryCreateInput): Promise<{
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
