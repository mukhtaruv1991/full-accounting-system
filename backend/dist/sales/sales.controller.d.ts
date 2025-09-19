import { SalesService } from './sales.service';
import { Prisma } from '@prisma/client';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    create(createSaleDto: Prisma.SaleCreateInput): any;
    findAll(): any;
    findOne(id: string): any;
    update(id: string, updateSaleDto: Prisma.SaleUpdateInput): any;
    remove(id: string): any;
}
