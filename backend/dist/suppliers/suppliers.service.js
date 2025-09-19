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
exports.SuppliersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let SuppliersService = class SuppliersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.supplier.create({ data });
    }
    async findAll(companyId) {
        return this.prisma.supplier.findMany({ where: { companyId } });
    }
    async findOne(id, companyId) {
        const supplier = await this.prisma.supplier.findFirst({
            where: { id, companyId },
        });
        if (!supplier) {
            throw new common_1.NotFoundException(`Supplier with ID \${id} not found for this company.\`);
    }
    return supplier;
  }

  async update(id: string, data: Prisma.SupplierUpdateInput, companyId: string): Promise<Supplier> {
    await this.findOne(id, companyId); // Verify ownership
    return this.prisma.supplier.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, companyId: string): Promise<Supplier> {
    await this.findOne(id, companyId); // Verify ownership
    return this.prisma.supplier.delete({ where: { id } });
  }
}
            );
        }
    }
};
exports.SuppliersService = SuppliersService;
exports.SuppliersService = SuppliersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SuppliersService);
//# sourceMappingURL=suppliers.service.js.map