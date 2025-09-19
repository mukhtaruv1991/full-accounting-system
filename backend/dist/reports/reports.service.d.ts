import ExcelJS from 'exceljs';
export declare class ReportsService {
    generateExcel(data: any[]): Promise<ExcelJS.Buffer>;
    generatePdf(data: any[]): Promise<Buffer>;
}
