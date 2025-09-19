import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() createSaleDto: Prisma.SaleCreateInput, @CurrentUser() user: any) {
    return this.salesService.create({ ...createSaleDto, companyId: user.companyId });
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.salesService.findAll(user.companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.salesService.findOne(id, user.companyId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSaleDto: Prisma.SaleUpdateInput, @CurrentUser() user: any) {
    return this.salesService.update(id, updateSaleDto, user.companyId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.salesService.remove(id, user.companyId);
  }
}
