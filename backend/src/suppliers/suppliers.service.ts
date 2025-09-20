import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Supplier } from '@prisma/client';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.SupplierCreateInput) {
    return this.prisma.supplier.create({ data });
  }

  findAll(companyId: string) {
    return this.prisma.supplier.findMany({ where: { companyId } });
  }

  async findOne(id: string, companyId: string): Promise<Supplier | null> {
    const supplier = await this.prisma.supplier.findFirst({
      where: { id, companyId },
    });
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found for this company.`);
    }
    return supplier;
  }

  async update(id: string, data: Prisma.SupplierUpdateInput, companyId: string): Promise<Supplier> {
    await this.findOne(id, companyId); // Verify ownership
    return this.prisma.supplier.update({ where: { id }, data });
  }

  async remove(id: string, companyId: string): Promise<Supplier> {
    await this.findOne(id, companyId); // Verify ownership
    return this.prisma.supplier.delete({ where: { id } });
  }
}
