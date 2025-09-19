import { PurchasesService } from './purchases.service';
import { Prisma } from '@prisma/client';
export declare class PurchasesController {
    private readonly purchasesService;
    constructor(purchasesService: PurchasesService);
    create(createPurchaseDto: Prisma.PurchaseCreateInput): Prisma.Prisma__PurchaseClient<{
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
    update(id: string, updatePurchaseDto: Prisma.PurchaseUpdateInput): Prisma.Prisma__PurchaseClient<{
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
