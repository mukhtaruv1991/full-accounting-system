import { Injectable } from '@nestjs/common';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

@Injectable()
export class ReportsService {
  async generateExcel(data: any[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');
    worksheet.addRow(['ID', 'Name', 'Amount']);
    data.forEach(item => {
      worksheet.addRow([item.id, item.name, item.amount]);
    });
    return await workbook.xlsx.writeBuffer();
  }

  async generatePdf(data: any[]): Promise<Buffer> {
    const doc = new PDFDocument({ margin: 50 });
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
}
