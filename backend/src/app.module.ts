import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { CustomersModule } from './customers/customers.module';
import { ItemsModule } from './items/items.module';
import { JournalEntriesModule } from './journal-entries/journal-entries.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PurchasesModule } from './purchases/purchases.module';
import { ReportsModule } from './reports/reports.module';
import { SalesModule } from './sales/sales.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    AccountsModule,
    CustomersModule,
    ItemsModule,
    JournalEntriesModule,
    NotificationsModule,
    PurchasesModule,
    ReportsModule,
    SalesModule,
    SuppliersModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
