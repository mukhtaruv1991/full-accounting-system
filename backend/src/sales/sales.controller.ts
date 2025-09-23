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
  create(@Body() createSaleDto: any, @CurrentUser() user: any) {
    const { customerId, ...restOfDto } = createSaleDto;
    const data: Prisma.SaleCreateInput = {
      ...restOfDto,
      company: { connect: { id: user.companyId } },
      customer: { connect: { id: customerId } },
    };
    return this.salesService.create(data);
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
