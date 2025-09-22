import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class SyncContactsDto {
  hashedPhones: string[];
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('sync-contacts')
  syncContacts(@Body() syncContactsDto: SyncContactsDto) {
    return this.usersService.findByHashedPhones(syncContactsDto.hashedPhones);
  }
}
