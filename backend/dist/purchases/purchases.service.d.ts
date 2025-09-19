import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
export declare class PurchasesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.PurchaseCreateInput): Prisma.Prisma__PurchaseClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        date: Date;
        totalAmount: number;
        supplierId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        date: Date;
        totalAmount: number;
        supplierId: string;
    }[]>;
    findOne(id: string): Prisma.Prisma__PurchaseClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        date: Date;
        totalAmount: number;
        supplierId: string;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: Prisma.PurchaseUpdateInput): Prisma.Prisma__PurchaseClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        date: Date;
        totalAmount: number;
        supplierId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): Prisma.Prisma__PurchaseClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        date: Date;
        totalAmount: number;
        supplierId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
