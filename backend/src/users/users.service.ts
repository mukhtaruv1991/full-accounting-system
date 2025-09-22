import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Company, MembershipRequest } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createAdminAndCompany(userData: any, companyData: any): Promise<{ user: User; company: Company }> {
    let user = await this.findUserByEmail(userData.email);
    if (user) {
      throw new ConflictException('User with this email already exists.');
    }

    const hashedPassword = await this.hashPassword(userData.password);
    
    const newCompany = await this.prisma.company.create({
      data: {
        name: companyData.name,
        address: companyData.address,
        phone: companyData.phone,
      },
    });

    const newUser = await this.prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: hashedPassword,
        memberships: {
          create: {
            companyId: newCompany.id,
            role: 'admin',
          },
        },
      },
    });

    return { user: newUser, company: newCompany };
  }

  async createManagerRequest(userData: any, companyId: string): Promise<MembershipRequest> {
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) {
      throw new NotFoundException('Company to join not found.');
    }

    let user = await this.findUserByEmail(userData.email);
    if (!user) {
      const hashedPassword = await this.hashPassword(userData.password);
      user = await this.prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          password: hashedPassword,
        },
      });
    }

    const existingRequest = await this.prisma.membershipRequest.findFirst({
      where: { userId: user.id, companyId: companyId, status: 'pending' },
    });

    if (existingRequest) {
      throw new ConflictException('A pending request for this company already exists for this user.');
    }

    return this.prisma.membershipRequest.create({
      data: {
        userId: user.id,
        companyId: companyId,
        status: 'pending',
      },
    });
  }

  async createNormalUser(userData: any): Promise<User> {
    const existingUser = await this.findUserByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists.');
    }
    const hashedPassword = await this.hashPassword(userData.password);
    return this.prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: hashedPassword,
      },
    });
  }

  async findOne(email: string): Promise<User | null> {
    return this.findUserByEmail(email);
  }

  async getUserMemberships(userId: string) {
    return this.prisma.membership.findMany({
      where: { userId },
      include: { company: true },
    });
  }
}
