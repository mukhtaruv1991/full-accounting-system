import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { NotificationsGateway } from '../notifications/notifications.gateway'; // Import gateway

// Helper function to hash phone numbers consistently
const hashPhoneNumber = (phone: string) => {
  return crypto.createHash('sha256').update(phone).digest('hex');
};

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private notificationsGateway: NotificationsGateway, // Inject gateway
  ) {}

  async create(data: Prisma.UserCreateInput, companyName?: string): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const phoneHash = data.phone ? hashPhoneNumber(data.phone) : null;

    let newUser: User;

    if (companyName) {
      // Logic for creating a new company and admin user
      const company = await this.prisma.company.create({
        data: { name: companyName },
      });
      newUser = await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          phone: data.phone,
          phoneHash: phoneHash,
          memberships: {
            create: {
              companyId: company.id,
              role: 'admin',
            },
          },
        },
      });
    } else {
      // Logic for creating a user without an initial company
      newUser = await this.prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
          phoneHash: phoneHash,
        },
      });
    }

    // After creating the user, notify friends
    if (newUser.phone) {
      this.notifyFriendsOfNewUser(newUser);
    }

    return newUser;
  }

  private async notifyFriendsOfNewUser(newUser: User) {
    if (!newUser.phone) return;

    // Find all users who have this new user's phone number in their synced contacts
    // This is a simplified approach. A real-world app would have a dedicated table for contacts.
    // For now, we'll simulate this by finding users who *could* be friends.
    // This logic should be improved in a production system.
    
    // We will emit a general event, and the client will decide if it's relevant.
    // A more advanced approach would be to query a 'contacts' table.
    const notificationPayload = {
      message: `${newUser.name} has joined the platform!`,
      newUser: { id: newUser.id, name: newUser.name },
    };
    
    // Emitting to a general room, clients will need to filter.
    // In a real app, you'd find specific user IDs and emit to their private rooms.
    this.notificationsGateway.server.emit('friendJoined', notificationPayload);
    console.log(`Emitted 'friendJoined' notification for ${newUser.name}`);
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
        phone: true,
      },
    });
  }
}
