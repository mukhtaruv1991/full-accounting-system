import { Module } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [PurchasesService, PrismaService],
  controllers: [PurchasesController],
  exports: [PurchasesService],
})
export class PurchasesModule {}
