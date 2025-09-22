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
      const company = await this.prisma.company.create({
        data: { name: companyName },
      });

      // Correctly connect the user to the company
      return this.prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          role: 'ADMIN', // Set a default role, e.g., 'ADMIN'
          company: {
            connect: { id: company.id },
          },
        },
      });
    }

    // This part is for creating a user without a company, if applicable
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
