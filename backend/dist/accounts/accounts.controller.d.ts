import { AccountsService } from './accounts.service';
import { Prisma } from '@prisma/client';
export declare class AccountsController {
    private readonly accountsService;
    constructor(accountsService: AccountsService);
    create(createAccountDto: Prisma.AccountUncheckedCreateInput, user: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        description: string | null;
        code: string;
        type: string;
        parentCode: string | null;
        isDebit: boolean;
    }>;
    findAll(user: any, search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        description: string | null;
        code: string;
        type: string;
        parentCode: string | null;
        isDebit: boolean;
    }[]>;
    findOne(id: string, user: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        description: string | null;
        code: string;
        type: string;
        parentCode: string | null;
        isDebit: boolean;
    }>;
    update(id: string, updateAccountDto: Prisma.AccountUpdateInput, user: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        description: string | null;
        code: string;
        type: string;
        parentCode: string | null;
        isDebit: boolean;
    }>;
    remove(id: string, user: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        description: string | null;
        code: string;
        type: string;
        parentCode: string | null;
        isDebit: boolean;
    }>;
}
