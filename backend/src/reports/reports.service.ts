import { Injectable } from '@nestjs/common';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

@Injectable()
export class ReportsService {
  // تم إزالة النوع الصريح: Promise<Buffer>
  async generateExcel(data: any[]) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');
    worksheet.addRow(['ID', 'Name', 'Amount']);
    data.forEach(item => {
      worksheet.addRow([item.id, item.name, item.amount]);
    });
    // سيتم استنتاج النوع الصحيح تلقائيًا
    return await workbook.xlsx.writeBuffer();
  }

  // تم تحسين هذه الدالة لتكون أكثر موثوقية
  async generatePdf(data: any[]): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const result = Buffer.concat(buffers);
        resolve(result);
      });

      doc.font('Helvetica-Bold').text('Accounting Report', { align: 'center' });
      doc.moveDown();

      // إضافة رأس الجدول
      doc.font('Helvetica-Bold');
      doc.text('ID', 50, doc.y, { width: 100 });
      doc.text('Name', 150, doc.y, { width: 200 });
      doc.text('Amount', 350, doc.y, { align: 'right', width: 150 });
      doc.moveDown();
      doc.font('Helvetica');

      // إضافة البيانات
      data.forEach(item => {
        doc.text(item.id, 50, doc.y, { width: 100 });
        doc.text(item.name, 150, doc.y, { width: 200 });
        doc.text(item.amount.toString(), 350, doc.y, { align: 'right', width: 150 });
        doc.moveDown(0.5);
      });

      doc.end();
    });
  }
}
