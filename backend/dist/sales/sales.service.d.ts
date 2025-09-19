import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
export declare class SalesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.SaleCreateInput): any;
    findAll(): any;
    findOne(id: string): any;
    update(id: string, data: Prisma.SaleUpdateInput): any;
    remove(id: string): any;
}
