import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ItemsService } from './items.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  create(@Body() createItemDto: Prisma.ItemCreateInput, @CurrentUser() user: any) {
    return this.itemsService.create({ ...createItemDto, companyId: user.companyId });
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.itemsService.findAll(user.companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.itemsService.findOne(id, user.companyId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateItemDto: Prisma.ItemUpdateInput, @CurrentUser() user: any) {
    return this.itemsService.update(id, updateItemDto, user.companyId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.itemsService.remove(id, user.companyId);
  }
}
