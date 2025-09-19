import { SuppliersService } from './suppliers.service';
import { Prisma } from '@prisma/client';
export declare class SuppliersController {
    private readonly suppliersService;
    constructor(suppliersService: SuppliersService);
    create(createSupplierDto: Prisma.SupplierCreateWithoutPurchasesInput, user: any): Promise<{
        name: string;
        id: string;
        email: string | null;
        phone: string | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(user: any): Promise<{
        name: string;
        id: string;
        email: string | null;
        phone: string | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string, user: any): Promise<{
        name: string;
        id: string;
        email: string | null;
        phone: string | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateSupplierDto: Prisma.SupplierUpdateInput, user: any): any;
    remove(id: string, user: any): any;
}
