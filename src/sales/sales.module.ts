import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [SalesService, PrismaService],
  controllers: [SalesController],
  exports: [SalesService],
})
export class SalesModule {}
