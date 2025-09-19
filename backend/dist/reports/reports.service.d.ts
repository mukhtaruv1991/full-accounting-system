export declare class ReportsService {
    generateExcel(data: any[]): Promise<Buffer>;
    generatePdf(data: any[]): Promise<Buffer>;
}
