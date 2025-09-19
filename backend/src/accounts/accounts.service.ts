import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Account } from '@prisma/client';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.AccountUncheckedCreateInput): Promise<Account> {
    return this.prisma.account.create({ data });
  }

  async findAll(companyId: string, params: { search?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }): Promise<Account[]> {
    const { search, sortBy, sortOrder } = params;

    const where: Prisma.AccountWhereInput = {
      companyId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
          { type: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const orderBy: Prisma.AccountOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder || 'asc' }
      : { createdAt: 'desc' };

    return this.prisma.account.findMany({
      where,
      orderBy,
    });
  }

  async findOne(id: string, companyId: string): Promise<Account | null> {
    const account = await this.prisma.account.findFirst({
      where: { id, companyId },
    });

    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found for this company.`);
    }
    return account;
  }

  async update(id: string, data: Prisma.AccountUpdateInput, companyId: string): Promise<Account> {
    await this.findOne(id, companyId); // Verify ownership before update
    return this.prisma.account.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, companyId: string): Promise<Account> {
    await this.findOne(id, companyId); // Verify ownership before delete
    return this.prisma.account.delete({ where: { id } });
  }
}
