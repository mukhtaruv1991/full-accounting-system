import { CustomersService } from './customers.service';
import { Prisma } from '@prisma/client';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(createCustomerDto: Prisma.CustomerCreateWithoutSalesInput, user: any): Promise<{
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
    update(id: string, updateCustomerDto: Prisma.CustomerUpdateInput, user: any): Promise<{
        name: string;
        id: string;
        email: string | null;
        phone: string | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string, user: any): Promise<{
        name: string;
        id: string;
        email: string | null;
        phone: string | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
