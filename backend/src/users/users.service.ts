import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { NotificationsService } from '../notifications/notifications.service';

const hashPhoneNumber = (phone: string) => {
  return crypto.createHash('sha256').update(phone).digest('hex');
};

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async createAdminAndCompany(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'phoneHash'>, companyData: { name: string; address?: string; phone?: string; }) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: userData.email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const phoneHash = userData.phone ? hashPhoneNumber(userData.phone) : null;

    const company = await this.prisma.company.create({
      data: { name: companyData.name, address: companyData.address, phone: companyData.phone },
    });

    const newUser = await this.prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        phone: userData.phone,
        phoneHash: phoneHash,
        memberships: {
          create: {
            companyId: company.id,
            role: 'admin',
          },
        },
      },
    });
    return newUser;
  }

  async createManagerRequest(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'phoneHash'>, companyIdToJoin: string) {
    const company = await this.prisma.company.findUnique({ where: { id: companyIdToJoin } });
    if (!company) {
      throw new BadRequestException('Company to join does not exist.');
    }
    
    const existingUser = await this.prisma.user.findUnique({ where: { email: userData.email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const phoneHash = userData.phone ? hashPhoneNumber(userData.phone) : null;

    const newUser = await this.prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        phone: userData.phone,
        phoneHash: phoneHash,
      },
    });

    await this.prisma.joinRequest.create({
      data: {
        userId: newUser.id,
        companyId: companyIdToJoin,
        status: 'pending',
      },
    });

    return { message: 'Request to join company has been sent for approval.' };
  }
  
  async createNormalUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'phoneHash'>) {
      // Logic for creating a user without an initial company
      const existingUser = await this.prisma.user.findUnique({ where: { email: userData.email } });
      if (existingUser) {
        throw new ConflictException('User with this email already exists.');
      }
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const phoneHash = userData.phone ? hashPhoneNumber(userData.phone) : null;
      
      const newUser = await this.prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          phone: userData.phone,
          phoneHash: phoneHash,
        },
      });
      return newUser;
  }

  async findByHashedPhones(hashedPhones: string[]): Promise<Pick<User, "id" | "name" | "phone">[]> {
    return this.prisma.user.findMany({
      where: {
        phoneHash: {
          in: hashedPhones,
        },
      },
      select: {
        id: true,
        name: true,
        phone: true,
      },
    });
  }

  findOne(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        memberships: {
          include: {
            company: true,
          },
        },
      },
    });
  }
  
  async getUserMemberships(userId: string) {
    return this.prisma.membership.findMany({
      where: { userId },
      include: { company: true },
    });
  }
}
