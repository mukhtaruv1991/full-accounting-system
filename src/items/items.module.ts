import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [ItemsService, PrismaService],
  controllers: [ItemsController],
  exports: [ItemsService],
})
export class ItemsModule {}
