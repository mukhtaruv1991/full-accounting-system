import { PurchasesService } from './purchases.service';
import { Prisma } from '@prisma/client';
export declare class PurchasesController {
    private readonly purchasesService;
    constructor(purchasesService: PurchasesService);
    create(createPurchaseDto: Prisma.PurchaseCreateInput): any;
    findAll(): any;
    findOne(id: string): any;
    update(id: string, updatePurchaseDto: Prisma.PurchaseUpdateInput): any;
    remove(id: string): any;
}
