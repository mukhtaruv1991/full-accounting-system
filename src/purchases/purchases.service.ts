import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Purchase } from '@prisma/client';

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.PurchaseCreateInput): Promise<Purchase> {
    return this.prisma.purchase.create({ data });
  }

  async findAll(companyId: string): Promise<Purchase[]> {
    return this.prisma.purchase.findMany({ where: { companyId } });
  }

  async findOne(id: string, companyId: string): Promise<Purchase | null> {
    const purchase = await this.prisma.purchase.findUnique({
      where: { id },
    });
    if (!purchase || purchase.companyId !== companyId) {
      throw new NotFoundException(`Purchase with ID ${id} not found for this company.`);
    }
    return purchase;
  }

  async update(id: string, data: Prisma.PurchaseUpdateInput, companyId: string): Promise<Purchase> {
    const existingPurchase = await this.prisma.purchase.findUnique({ where: { id } });
    if (!existingPurchase || existingPurchase.companyId !== companyId) {
      throw new NotFoundException(`Purchase with ID ${id} not found for this company.`);
    }
    return this.prisma.purchase.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, companyId: string): Promise<Purchase> {
    const existingPurchase = await this.prisma.purchase.findUnique({ where: { id } });
    if (!existingPurchase || existingPurchase.companyId !== companyId) {
      throw new NotFoundException(`Purchase with ID ${id} not found for this company.`);
    }
    return this.prisma.purchase.delete({ where: { id } });
  }
}
