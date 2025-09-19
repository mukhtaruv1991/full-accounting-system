import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Item } from '@prisma/client';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ItemCreateInput): Promise<Item> {
    return this.prisma.item.create({ data });
  }

  async findAll(companyId: string): Promise<Item[]> {
    return this.prisma.item.findMany({ where: { companyId } });
  }

  async findOne(id: string, companyId: string): Promise<Item | null> {
    const item = await this.prisma.item.findUnique({
      where: { id },
    });
    if (!item || item.companyId !== companyId) {
      throw new NotFoundException(`Item with ID ${id} not found for this company.`);
    }
    return item;
  }

  async update(id: string, data: Prisma.ItemUpdateInput, companyId: string): Promise<Item> {
    const existingItem = await this.prisma.item.findUnique({ where: { id } });
    if (!existingItem || existingItem.companyId !== companyId) {
      throw new NotFoundException(`Item with ID ${id} not found for this company.`);
    }
    return this.prisma.item.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, companyId: string): Promise<Item> {
    const existingItem = await this.prisma.item.findUnique({ where: { id } });
    if (!existingItem || existingItem.companyId !== companyId) {
      throw new NotFoundException(`Item with ID ${id} not found for this company.`);
    }
    return this.prisma.item.delete({ where: { id } });
  }
}
