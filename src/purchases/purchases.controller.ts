import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post()
  create(@Body() createPurchaseDto: Prisma.PurchaseCreateInput, @CurrentUser() user: any) {
    return this.purchasesService.create({ ...createPurchaseDto, companyId: user.companyId });
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.purchasesService.findAll(user.companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.purchasesService.findOne(id, user.companyId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePurchaseDto: Prisma.PurchaseUpdateInput, @CurrentUser() user: any) {
    return this.purchasesService.update(id, updatePurchaseDto, user.companyId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.purchasesService.remove(id, user.companyId);
  }
}
