import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: { memberships: { include: { company: true } } },
    });
  }

  async createAdminAndCompany(userData: Prisma.UserCreateInput, companyData: { name: string; address?: string; phone?: string; }) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: userData.email } });
    if (existingUser) throw new ConflictException('User with this email already exists.');

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    return this.prisma.company.create({
      data: {
        ...companyData,
        memberships: {
          create: {
            role: 'admin',
            user: {
              create: {
                ...userData,
                password: hashedPassword,
                phoneHash: userData.phone ? crypto.createHash('sha256').update(userData.phone).digest('hex') : null,
              },
            },
          },
        },
      },
    });
  }

  async createManagerRequest(userData: Prisma.UserCreateInput, companyIdToJoin: string) {
    const company = await this.prisma.company.findUnique({ where: { id: companyIdToJoin } });
    if (!company) throw new NotFoundException('Company not found.');

    const existingUser = await this.prisma.user.findUnique({ where: { email: userData.email } });
    if (existingUser) throw new ConflictException('User with this email already exists.');
    
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        phoneHash: userData.phone ? crypto.createHash('sha256').update(userData.phone).digest('hex') : null,
      }
    });

    await this.prisma.joinRequest.create({
      data: {
        userId: user.id,
        companyId: companyIdToJoin,
        status: 'pending',
      }
    });
    return { message: 'Request to join company has been sent.' };
  }

  async createNormalUser(userData: Prisma.UserCreateInput) {
     const existingUser = await this.prisma.user.findUnique({ where: { email: userData.email } });
    if (existingUser) throw new ConflictException('User with this email already exists.');

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        phoneHash: userData.phone ? crypto.createHash('sha256').update(userData.phone).digest('hex') : null,
      }
    });
  }
  
  async getUserMemberships(userId: string) {
    return this.prisma.membership.findMany({
      where: { userId },
      include: { company: true },
    });
  }
}
