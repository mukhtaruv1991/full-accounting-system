import { PrismaService } from '../prisma.service';
import { Prisma, Customer } from '@prisma/client';
export declare class CustomersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.CustomerUncheckedCreateInput): Promise<Customer>;
    findAll(companyId: string): Promise<Customer[]>;
    findOne(id: string, companyId: string): Promise<Customer | null>;
    update(id: string, data: Prisma.CustomerUpdateInput, companyId: string): Promise<Customer>;
    remove(id: string, companyId: string): Promise<Customer>;
}
