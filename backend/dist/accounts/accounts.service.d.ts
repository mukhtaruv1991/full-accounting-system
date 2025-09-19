import { PrismaService } from '../prisma.service';
import { Prisma, Account } from '@prisma/client';
export declare class AccountsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.AccountUncheckedCreateInput): Promise<Account>;
    findAll(companyId: string, params: {
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<Account[]>;
    findOne(id: string, companyId: string): Promise<Account | null>;
    update(id: string, data: Prisma.AccountUpdateInput, companyId: string): Promise<Account>;
    remove(id: string, companyId: string): Promise<Account>;
}
