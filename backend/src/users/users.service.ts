import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

// Helper function to hash phone numbers consistently
const hashPhoneNumber = (phone: string) => {
  return crypto.createHash('sha256').update(phone).digest('hex');
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput, companyName?: string): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const phoneHash = data.phone ? hashPhoneNumber(data.phone) : null;

    if (companyName) {
      const company = await this.prisma.company.create({
        data: { name: companyName },
      });

      const user = await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          phone: data.phone,
          phoneHash: phoneHash,
          company: {
            create: {
              companyId: company.id,
              role: 'admin',
            },
          },
        },
      });
      return user;
    }

    // This part is for creating users without an initial company (e.g., invited users)
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        phoneHash: phoneHash,
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

  // New method to find users by hashed phone numbers
  async findByHashedPhones(hashedPhones: string[]): Promise<Pick<User, 'id' | 'name' | 'phone'>[]> {
    return this.prisma.user.findMany({
      where: {
        phoneHash: {
          in: hashedPhones,
        },
      },
      select: {
        id: true,
        name: true,
        phone: true, // We can return the phone number to the user who already has it
      },
    });
  }
}
