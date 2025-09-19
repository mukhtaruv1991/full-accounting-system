import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput, companyName?: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    if (companyName) {
      // This is an admin registering a new company
      const company = await this.prisma.company.create({
        data: {
          name: companyName,
        },
      });

      return this.prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
          companyId: company.id,
          role: 'admin', // The first user of a company is an admin
        },
      });
    }

    // This case can be used later for inviting users to an existing company
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  findOne(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
