import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@Body() createAccountDto: Prisma.AccountUncheckedCreateInput, @CurrentUser() user: any) {
    // الربط مع الشركة يتم الآن مباشرة في الخدمة
    const dataWithCompany = { ...createAccountDto, companyId: user.companyId };
    return this.accountsService.create(dataWithCompany);
  }

  @Get()
  findAll(
    @CurrentUser() user: any,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.accountsService.findAll(user.companyId, { search, sortBy, sortOrder });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.accountsService.findOne(id, user.companyId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: Prisma.AccountUpdateInput, @CurrentUser() user: any) {
    return this.accountsService.update(id, updateAccountDto, user.companyId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.accountsService.remove(id, user.companyId);
  }
}
