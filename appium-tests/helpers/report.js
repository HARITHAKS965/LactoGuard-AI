const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const testResults = [];

function recordTestResult(result) {
  testResults.push(result);
}

async function generateExcelReport() {
  const reportsDir = path.join(__dirname, '..', 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Appium Mobile QA Engineer';
  workbook.created = new Date();

  // Primary sheet matching exact Selenium Test Results layout
  const worksheet = workbook.addWorksheet('Appium Test Results');
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

  testResults.forEach(r => {
    const row = worksheet.addRow({
      testId: r.testId,
      testName: r.testName,
      category: r.category || 'Appium Mobile E2E',
      status: r.status,
      errorMessage: r.errorMessage || 'N/A',
      durationMs: r.durationMs,
      timestamp: r.timestamp,
      screenshotPath: r.screenshotPath || 'N/A'
    });

    const statusCell = row.getCell(4);
    if (r.status === 'PASS') {
      statusCell.font = { color: { argb: '15803D' }, bold: true };
    } else {
      statusCell.font = { color: { argb: 'B91C1C' }, bold: true };
    }
  });

  const filePath = path.join(reportsDir, 'appium-report.xlsx');
  await workbook.xlsx.writeFile(filePath);
  return filePath;
}

module.exports = { recordTestResult, generateExcelReport, testResults };
