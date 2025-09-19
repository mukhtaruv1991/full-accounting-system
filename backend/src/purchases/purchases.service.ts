import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.PurchaseCreateInput) {
    return this.prisma.purchase.create({ data });
  }

  findAll() {
    return this.prisma.purchase.findMany();
  }

  findOne(id: string) {
    return this.prisma.purchase.findUnique({ where: { id } });
  }

  update(id: string, data: Prisma.PurchaseUpdateInput) {
    return this.prisma.purchase.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.purchase.delete({ where: { id } });
  }
}
