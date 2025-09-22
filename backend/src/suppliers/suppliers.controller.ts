import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  create(@Body() createSupplierDto: Prisma.SupplierCreateWithoutCompanyInput, @CurrentUser() user: any) {
    const dataWithCompany: Prisma.SupplierUncheckedCreateInput = {
       ...createSupplierDto,
       companyId: user.companyId 
    };
    return this.suppliersService.create(dataWithCompany);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.suppliersService.findAll(user.companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.suppliersService.findOne(id, user.companyId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSupplierDto: Prisma.SupplierUpdateInput, @CurrentUser() user: any) {
    return this.suppliersService.update(id, updateSupplierDto, user.companyId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.suppliersService.remove(id, user.companyId);
  }
}
