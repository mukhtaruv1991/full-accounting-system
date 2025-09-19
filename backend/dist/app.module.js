"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_service_1 = require("./prisma.service");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const accounts_module_1 = require("./accounts/accounts.module");
const customers_module_1 = require("./customers/customers.module");
const items_module_1 = require("./items/items.module");
const journal_entries_module_1 = require("./journal-entries/journal-entries.module");
const notifications_module_1 = require("./notifications/notifications.module");
const purchases_module_1 = require("./purchases/purchases.module");
const reports_module_1 = require("./reports/reports.module");
const sales_module_1 = require("./sales/sales.module");
const suppliers_module_1 = require("./suppliers/suppliers.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            accounts_module_1.AccountsModule,
            customers_module_1.CustomersModule,
            items_module_1.ItemsModule,
            journal_entries_module_1.JournalEntriesModule,
            notifications_module_1.NotificationsModule,
            purchases_module_1.PurchasesModule,
            reports_module_1.ReportsModule,
            sales_module_1.SalesModule,
            suppliers_module_1.SuppliersModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, prisma_service_1.PrismaService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map