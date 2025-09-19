import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
export declare class PurchasesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.PurchaseCreateInput): any;
    findAll(): any;
    findOne(id: string): any;
    update(id: string, data: Prisma.PurchaseUpdateInput): any;
    remove(id: string): any;
}
