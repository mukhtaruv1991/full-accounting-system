import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { NotificationsGateway } from '../notifications/notifications.gateway';
export declare class JournalEntriesService {
    private prisma;
    private notificationsGateway;
    constructor(prisma: PrismaService, notificationsGateway: NotificationsGateway);
    create(data: Prisma.JournalEntryCreateInput): Promise<any>;
}
