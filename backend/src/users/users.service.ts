import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

interface CreateUserAndCompanyDto {
  email: string;
  password: string;
  companyName: string;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserAndCompanyDto): Promise<User> {
    const { email, password, companyName } = data;

    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await this.prisma.user.create({
        data: { email, password: hashedPassword },
      });
    }

    const company = await this.prisma.company.create({
      data: { name: companyName },
    });

    // Create a membership record linking the user and the new company
    await this.prisma.membership.create({
      data: {
        userId: user.id,
        companyId: company.id,
        role: 'ADMIN', // The creator of the company is the ADMIN
      },
    });

    return user;
  }

  async findOne(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        memberships: { // Include all memberships for the user
          include: {
            company: true, // Also include company details for each membership
          },
        },
      },
    });
  }
}
