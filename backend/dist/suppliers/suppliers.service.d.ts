import { PrismaService } from '../prisma.service';
import { Prisma, Supplier } from '@prisma/client';
export declare class SuppliersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.SupplierUncheckedCreateInput): Promise<Supplier>;
    findAll(companyId: string): Promise<Supplier[]>;
    findOne(id: string, companyId: string): Promise<Supplier | null>;
}
