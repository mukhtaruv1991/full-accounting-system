import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
export declare class ItemsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.ItemCreateInput): Prisma.Prisma__ItemClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        description: string | null;
        price: number;
        stock: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        description: string | null;
        price: number;
        stock: number;
    }[]>;
    findOne(id: string): Prisma.Prisma__ItemClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        description: string | null;
        price: number;
        stock: number;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: Prisma.ItemUpdateInput): Prisma.Prisma__ItemClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        description: string | null;
        price: number;
        stock: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): Prisma.Prisma__ItemClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        description: string | null;
        price: number;
        stock: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
