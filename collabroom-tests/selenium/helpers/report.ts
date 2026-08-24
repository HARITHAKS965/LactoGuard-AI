import * as ExcelJS from 'exceljs';
import * as path from 'path';
import * as fs from 'fs';

export interface TestResultRow {
  testId: string;
  testName: string;
  category: string;
  status: 'PASS' | 'FAIL';
  errorMessage?: string;
  durationMs: number;
  timestamp: string;
  screenshotPath?: string;
}

const testResults: TestResultRow[] = [];

export function recordTestResult(result: TestResultRow) {
  testResults.push(result);
}

export function getTestResults(): TestResultRow[] {
  return testResults;
}

export async function generateExcelReport(reportPath?: string): Promise<string> {
  const targetDir = path.resolve(__dirname, '../../reports');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const finalPath = reportPath || path.join(targetDir, 'selenium-report.xlsx');

  let workbook = new ExcelJS.Workbook();
  let worksheet: ExcelJS.Worksheet;

  if (fs.existsSync(finalPath)) {
    try {
      await workbook.xlsx.readFile(finalPath);
      worksheet = workbook.getWorksheet('Selenium Test Results') || workbook.addWorksheet('Selenium Test Results');
    } catch {
      workbook = new ExcelJS.Workbook();
      worksheet = workbook.addWorksheet('Selenium Test Results');
    }
  } else {
    worksheet = workbook.addWorksheet('Selenium Test Results');
    worksheet.columns = [
      { header: 'Test ID', key: 'testId', width: 12 },
      { header: 'Test Name', key: 'testName', width: 45 },
      { header: 'Category', key: 'category', width: 30 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Error Message', key: 'errorMessage', width: 40 },
      { header: 'Duration (ms)', key: 'durationMs', width: 16 },
      { header: 'Timestamp', key: 'timestamp', width: 25 },
      { header: 'Screenshot path', key: 'screenshotPath', width: 35 }
    ];

    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '1E293B' }
    };
  }

  testResults.forEach(res => {
    const row = worksheet.addRow({
      testId: res.testId,
      testName: res.testName,
      category: res.category,
      status: res.status,
      errorMessage: res.errorMessage || 'N/A',
      durationMs: res.durationMs,
      timestamp: res.timestamp,
      screenshotPath: res.screenshotPath || 'N/A'
    });

    const statusCell = row.getCell(4);
    if (res.status === 'PASS') {
      statusCell.font = { color: { argb: '15803D' }, bold: true };
    } else {
      statusCell.font = { color: { argb: 'B91C1C' }, bold: true };
    }
  });

  await workbook.xlsx.writeFile(finalPath);
  return finalPath;
}
