import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Sale } from '@prisma/client';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.SaleCreateInput): Promise<Sale> {
    return this.prisma.sale.create({ data });
  }

  async findAll(companyId: string): Promise<Sale[]> {
    return this.prisma.sale.findMany({ where: { companyId } });
  }

  async findOne(id: string, companyId: string): Promise<Sale | null> {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
    });
    if (!sale || sale.companyId !== companyId) {
      throw new NotFoundException(`Sale with ID ${id} not found for this company.`);
    }
    return sale;
  }

  async update(id: string, data: Prisma.SaleUpdateInput, companyId: string): Promise<Sale> {
    const existingSale = await this.prisma.sale.findUnique({ where: { id } });
    if (!existingSale || existingSale.companyId !== companyId) {
      throw new NotFoundException(`Sale with ID ${id} not found for this company.`);
    }
    return this.prisma.sale.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, companyId: string): Promise<Sale> {
    const existingSale = await this.prisma.sale.findUnique({ where: { id } });
    if (!existingSale || existingSale.companyId !== companyId) {
      throw new NotFoundException(`Sale with ID ${id} not found for this company.`);
    }
    return this.prisma.sale.delete({ where: { id } });
  }
}
