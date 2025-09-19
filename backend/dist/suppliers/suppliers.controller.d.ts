import { SuppliersService } from './suppliers.service';
import { Prisma } from '@prisma/client';
export declare class SuppliersController {
    private readonly suppliersService;
    constructor(suppliersService: SuppliersService);
    create(createSupplierDto: Prisma.SupplierCreateInput): any;
    findAll(): any;
    findOne(id: string): any;
    update(id: string, updateSupplierDto: Prisma.SupplierUpdateInput): any;
    remove(id: string): any;
}
