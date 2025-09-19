import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [SuppliersService, PrismaService],
  controllers: [SuppliersController],
  exports: [SuppliersService],
})
export class SuppliersModule {}
