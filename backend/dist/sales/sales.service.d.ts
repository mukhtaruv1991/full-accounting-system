import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
export declare class SalesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.SaleCreateInput): Prisma.Prisma__SaleClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        date: Date;
        totalAmount: number;
        customerId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        date: Date;
        totalAmount: number;
        customerId: string;
    }[]>;
    findOne(id: string): Prisma.Prisma__SaleClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        date: Date;
        totalAmount: number;
        customerId: string;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: Prisma.SaleUpdateInput): Prisma.Prisma__SaleClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        date: Date;
        totalAmount: number;
        customerId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): Prisma.Prisma__SaleClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        date: Date;
        totalAmount: number;
        customerId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
