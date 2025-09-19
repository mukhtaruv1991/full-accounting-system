"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let AccountsService = class AccountsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.account.create({ data });
    }
    async findAll(companyId, params) {
        const { search, sortBy, sortOrder } = params;
        const where = {
            companyId,
            ...(search && {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { code: { contains: search, mode: 'insensitive' } },
                    { type: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        const orderBy = sortBy
            ? { [sortBy]: sortOrder || 'asc' }
            : { createdAt: 'desc' };
        return this.prisma.account.findMany({
            where,
            orderBy,
        });
    }
    async findOne(id, companyId) {
        const account = await this.prisma.account.findFirst({
            where: { id, companyId },
        });
        if (!account) {
            throw new common_1.NotFoundException(`Account with ID ${id} not found for this company.`);
        }
        return account;
    }
    async update(id, data, companyId) {
        await this.findOne(id, companyId);
        return this.prisma.account.update({
            where: { id },
            data,
        });
    }
    async remove(id, companyId) {
        await this.findOne(id, companyId);
        return this.prisma.account.delete({ where: { id } });
    }
};
exports.AccountsService = AccountsService;
exports.AccountsService = AccountsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AccountsService);
//# sourceMappingURL=accounts.service.js.map