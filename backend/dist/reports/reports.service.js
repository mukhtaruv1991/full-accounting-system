"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const exceljs_1 = require("exceljs");
const pdfkit_1 = require("pdfkit");
let ReportsService = class ReportsService {
    async generateExcel(data) {
        const workbook = new exceljs_1.default.Workbook();
        const worksheet = workbook.addWorksheet('Report');
        worksheet.addRow(['ID', 'Name', 'Amount']);
        data.forEach(item => {
            worksheet.addRow([item.id, item.name, item.amount]);
        });
        return await workbook.xlsx.writeBuffer();
    }
    async generatePdf(data) {
        const doc = new pdfkit_1.default({ margin: 50 });
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const result = Buffer.concat(buffers);
            return result;
        });
        doc.text('تقرير المحاسبة', { align: 'right' });
        doc.moveDown();
        data.forEach(item => {
            doc.text(`ID: ${item.id}, Name: ${item.name}, Amount: ${item.amount}`, { align: 'right' });
        });
        doc.end();
        return new Promise(resolve => {
            doc.on('end', () => {
                resolve(Buffer.concat(buffers));
            });
        });
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)()
], ReportsService);
//# sourceMappingURL=reports.service.js.map