import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.UserCreateInput, companyName?: string): Promise<{
        id: string;
        email: string;
        password: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string | null;
    }>;
    findOne(email: string): Prisma.Prisma__UserClient<{
        id: string;
        email: string;
        password: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string | null;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
}
