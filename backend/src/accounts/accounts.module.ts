import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [AccountsService, PrismaService],
  controllers: [AccountsController],
})
export class AccountsModule {}
