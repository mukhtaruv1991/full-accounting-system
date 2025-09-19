import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
export declare class ItemsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.ItemCreateInput): any;
    findAll(): any;
    findOne(id: string): any;
    update(id: string, data: Prisma.ItemUpdateInput): any;
    remove(id: string): any;
}
