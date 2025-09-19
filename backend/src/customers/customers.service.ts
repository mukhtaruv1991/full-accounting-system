import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Customer } from '@prisma/client';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CustomerUncheckedCreateInput): Promise<Customer> {
    return this.prisma.customer.create({ data });
  }

  async findAll(companyId: string): Promise<Customer[]> {
    return this.prisma.customer.findMany({ where: { companyId } });
  }

  async findOne(id: string, companyId: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findFirst({
      where: { id, companyId },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found for this company.`);
    }
    return customer;
  }

  async update(id: string, data: Prisma.CustomerUpdateInput, companyId: string): Promise<Customer> {
    await this.findOne(id, companyId); // Verify ownership
    return this.prisma.customer.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, companyId: string): Promise<Customer> {
    await this.findOne(id, companyId); // Verify ownership
    return this.prisma.customer.delete({ where: { id } });
  }
}
