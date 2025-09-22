import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

// Define a DTO for user creation data to ensure type safety
interface CreateUserDto {
  email: string;
  password: string;
  name?: string; // Name is optional as it's not in the User model
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(userData: CreateUserDto, companyName: string): Promise<User> {
    const { email, password } = userData;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the company first
    const company = await this.prisma.company.create({
      data: { name: companyName },
    });

    // Then create the user and connect it to the new company
    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'ADMIN', // Default role for the first user of a company
        company: {
          connect: {
            id: company.id,
          },
        },
      },
    });

    return newUser;
  }

  async findOne(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
