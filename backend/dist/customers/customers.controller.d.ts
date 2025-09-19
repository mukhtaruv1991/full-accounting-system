import { CustomersService } from './customers.service';
import { Prisma } from '@prisma/client';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(createCustomerDto: Prisma.CustomerCreateInput): any;
    findAll(): any;
    findOne(id: string): any;
    update(id: string, updateCustomerDto: Prisma.CustomerUpdateInput): any;
    remove(id: string): any;
}
