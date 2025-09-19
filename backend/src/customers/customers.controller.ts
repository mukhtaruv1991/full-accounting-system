import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() createCustomerDto: Prisma.CustomerCreateWithoutSalesInput, @CurrentUser() user: any) {
    const dataWithCompany: Prisma.CustomerUncheckedCreateInput = {
      ...createCustomerDto,
      companyId: user.companyId,
    };
    return this.customersService.create(dataWithCompany);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.customersService.findAll(user.companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.customersService.findOne(id, user.companyId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: Prisma.CustomerUpdateInput, @CurrentUser() user: any) {
    return this.customersService.update(id, updateCustomerDto, user.companyId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.customersService.remove(id, user.companyId);
  }
}
