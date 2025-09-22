import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Sale } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class SalesService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(data: Prisma.SaleCreateInput): Promise<Sale> {
    const sale = await this.prisma.sale.create({
      data,
      include: { customer: true, company: true },
    });

    // Find admin of the company to notify them
    const companyAdmin = await this.prisma.membership.findFirst({
      where: { companyId: sale.companyId, role: 'admin' },
    });

    if (companyAdmin) {
      await this.notificationsService.create({
        userId: companyAdmin.userId,
        type: 'NEW_SALE',
        message: `New sale of ${sale.totalAmount} to ${sale.customer.name}.`,
        entityId: sale.id,
      });
    }

    return sale;
  }

  // ... (findAll, findOne, update, remove methods remain the same)
  async findAll(companyId: string): Promise<Sale[]> {
    return this.prisma.sale.findMany({ where: { companyId } });
  }

  async findOne(id: string, companyId: string): Promise<Sale | null> {
    const sale = await this.prisma.sale.findUnique({ where: { id } });
    if (!sale || sale.companyId !== companyId) {
      throw new NotFoundException(`Sale with ID ${id} not found.`);
    }
    return sale;
  }

  async update(id: string, data: Prisma.SaleUpdateInput, companyId: string): Promise<Sale> {
    await this.findOne(id, companyId);
    return this.prisma.sale.update({ where: { id }, data });
  }

  async remove(id: string, companyId: string): Promise<Sale> {
    await this.findOne(id, companyId);
    return this.prisma.sale.delete({ where: { id } });
  }
}
