import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    // Note: user object now contains a `memberships` array
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    // For now, we'll sign a token with the user's ID and email.
    // The frontend will be responsible for letting the user choose a company.
    const payload = {
      email: user.email,
      sub: user.id,
    };
    
    // We return the access token along with the list of available companies (memberships)
    return {
      access_token: this.jwtService.sign(payload),
      memberships: user.memberships,
    };
  }
}
