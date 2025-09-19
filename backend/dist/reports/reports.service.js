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
        return new Promise((resolve) => {
            const doc = new pdfkit_1.default({ margin: 50 });
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const result = Buffer.concat(buffers);
                resolve(result);
            });
            doc.font('Helvetica-Bold').text('Accounting Report', { align: 'center' });
            doc.moveDown();
            doc.font('Helvetica-Bold');
            doc.text('ID', 50, doc.y, { width: 100 });
            doc.text('Name', 150, doc.y, { width: 200 });
            doc.text('Amount', 350, doc.y, { align: 'right', width: 150 });
            doc.moveDown();
            doc.font('Helvetica');
            data.forEach(item => {
                doc.text(item.id, 50, doc.y, { width: 100 });
                doc.text(item.name, 150, doc.y, { width: 200 });
                doc.text(item.amount.toString(), 350, doc.y, { align: 'right', width: 150 });
                doc.moveDown(0.5);
            });
            doc.end();
        });
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)()
], ReportsService);
//# sourceMappingURL=reports.service.js.map