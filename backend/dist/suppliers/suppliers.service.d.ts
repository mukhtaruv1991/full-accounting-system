import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
export declare class SuppliersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.SupplierCreateInput): any;
    findAll(): any;
    findOne(id: string): any;
    update(id: string, data: Prisma.SupplierUpdateInput): any;
    remove(id: string): any;
}
