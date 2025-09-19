import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Supplier } from '@prisma/client';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.SupplierCreateInput): Promise<Supplier> {
    return this.prisma.supplier.create({ data });
  }

  async findAll(companyId: string): Promise<Supplier[]> {
    return this.prisma.supplier.findMany({ where: { companyId } });
  }

  async findOne(id: string, companyId: string): Promise<Supplier | null> {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
    });
    if (!supplier || supplier.companyId !== companyId) {
      throw new NotFoundException(`Supplier with ID ${id} not found for this company.`);
    }
    return supplier;
  }

  async update(id: string, data: Prisma.SupplierUpdateInput, companyId: string): Promise<Supplier> {
    const existingSupplier = await this.prisma.supplier.findUnique({ where: { id } });
    if (!existingSupplier || existingSupplier.companyId !== companyId) {
      throw new NotFoundException(`Supplier with ID ${id} not found for this company.`);
    }
    return this.prisma.supplier.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, companyId: string): Promise<Supplier> {
    const existingSupplier = await this.prisma.supplier.findUnique({ where: { id } });
    if (!existingSupplier || existingSupplier.companyId !== companyId) {
      throw new NotFoundException(`Supplier with ID ${id} not found for this company.`);
    }
    return this.prisma.supplier.delete({ where: { id } });
  }
}
