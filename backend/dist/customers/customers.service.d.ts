import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
export declare class CustomersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.CustomerCreateInput): any;
    findAll(): any;
    findOne(id: string): any;
    update(id: string, data: Prisma.CustomerUpdateInput): any;
    remove(id: string): any;
}
