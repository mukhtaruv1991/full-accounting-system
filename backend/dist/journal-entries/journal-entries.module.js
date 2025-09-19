"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JournalEntriesModule = void 0;
const common_1 = require("@nestjs/common");
const journal_entries_controller_1 = require("./journal-entries.controller");
const journal_entries_service_1 = require("./journal-entries.service");
const prisma_service_1 = require("../prisma.service");
const notifications_module_1 = require("../notifications/notifications.module");
let JournalEntriesModule = class JournalEntriesModule {
};
exports.JournalEntriesModule = JournalEntriesModule;
exports.JournalEntriesModule = JournalEntriesModule = __decorate([
    (0, common_1.Module)({
        imports: [notifications_module_1.NotificationsModule],
        controllers: [journal_entries_controller_1.JournalEntriesController],
        providers: [journal_entries_service_1.JournalEntriesService, prisma_service_1.PrismaService],
    })
], JournalEntriesModule);
//# sourceMappingURL=journal-entries.module.js.map