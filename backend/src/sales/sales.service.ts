import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.SaleCreateInput) {
    return this.prisma.sale.create({ data });
  }

  findAll() {
    return this.prisma.sale.findMany();
  }

  findOne(id: string) {
    return this.prisma.sale.findUnique({ where: { id } });
  }

  update(id: string, data: Prisma.SaleUpdateInput) {
    return this.prisma.sale.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.sale.delete({ where: { id } });
  }
}
