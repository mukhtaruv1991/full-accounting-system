import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // The registration logic has been moved to AuthController.
  // This controller can be used for other user-related actions in the future (e.g., get profile).
}
