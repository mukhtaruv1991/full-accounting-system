import { Module, forwardRef } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [NotificationsService, NotificationsGateway],
  exports: [NotificationsGateway, NotificationsService], // Export service as well
})
export class NotificationsModule {}
