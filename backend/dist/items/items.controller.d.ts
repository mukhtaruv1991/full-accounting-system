import { ItemsService } from './items.service';
import { Prisma } from '@prisma/client';
export declare class ItemsController {
    private readonly itemsService;
    constructor(itemsService: ItemsService);
    create(createItemDto: Prisma.ItemCreateInput): any;
    findAll(): any;
    findOne(id: string): any;
    update(id: string, updateItemDto: Prisma.ItemUpdateInput): any;
    remove(id: string): any;
}
