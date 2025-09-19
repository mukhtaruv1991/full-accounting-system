import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Account } from '@prisma/client';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.AccountCreateInput): Promise<Account> {
    return this.prisma.account.create({ data });
  }

  async findAll(companyId: string): Promise<Account[]> {
    return this.prisma.account.findMany({ where: { companyId } });
  }

  async findOne(id: string, companyId: string): Promise<Account | null> {
    const account = await this.prisma.account.findUnique({
      where: { id },
    });

    if (!account || account.companyId !== companyId) {
      throw new NotFoundException(`Account with ID ${id} not found for this company.`);
    }
    return account;
  }

  async update(id: string, data: Prisma.AccountUpdateInput, companyId: string): Promise<Account> {
    const existingAccount = await this.prisma.account.findUnique({ where: { id } });
    if (!existingAccount || existingAccount.companyId !== companyId) {
      throw new NotFoundException(`Account with ID ${id} not found for this company.`);
    }
    return this.prisma.account.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, companyId: string): Promise<Account> {
    const existingAccount = await this.prisma.account.findUnique({ where: { id } });
    if (!existingAccount || existingAccount.companyId !== companyId) {
      throw new NotFoundException(`Account with ID ${id} not found for this company.`);
    }
    return this.prisma.account.delete({ where: { id } });
  }
}
