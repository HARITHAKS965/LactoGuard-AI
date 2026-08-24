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
  workbook.creator = 'Collabroom QA Automation Engineer';
  workbook.created = new Date();

  // 1. SUMMARY SHEET
  const summarySheet = workbook.addWorksheet('Summary');
  summarySheet.columns = [
    { header: 'Metric', key: 'metric', width: 30 },
    { header: 'Value', key: 'value', width: 25 }
  ];

  const total = testResults.length;
  const passed = testResults.filter(r => r.status === 'PASS').length;
  const failed = testResults.filter(r => r.status === 'FAIL').length;
  const totalDuration = testResults.reduce((acc, r) => acc + (r.durationMs || 0), 0);

  summarySheet.addRows([
    { metric: 'Total Test Cases Executed', value: total },
    { metric: 'Passed Test Cases', value: passed },
    { metric: 'Failed Test Cases', value: failed },
    { metric: 'Pass Rate (%)', value: total > 0 ? `${((passed / total) * 100).toFixed(2)}%` : '0%' },
    { metric: 'Total Execution Duration (ms)', value: totalDuration },
    { metric: 'Environment', value: 'Headless Chrome (Windows 11)' },
    { metric: 'Execution Date', value: new Date().toISOString() }
  ]);

  summarySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
  summarySheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '0284C7' }
  };

  // 2. TEST DETAILS SHEET
  const detailsSheet = workbook.addWorksheet('Test Details');
  detailsSheet.columns = [
    { header: 'Test ID', key: 'testId', width: 12 },
    { header: 'Test Name', key: 'testName', width: 55 },
    { header: 'Category', key: 'category', width: 35 },
    { header: 'Status', key: 'status', width: 12 },
    { header: 'Execution Time (ms)', key: 'durationMs', width: 22 },
    { header: 'Timestamp', key: 'timestamp', width: 28 },
    { header: 'Error Message', key: 'errorMessage', width: 40 },
    { header: 'Environment', key: 'environment', width: 30 }
  ];

  detailsSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
  detailsSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '0F172A' }
  };

  testResults.forEach(r => {
    const row = detailsSheet.addRow({
      testId: r.testId,
      testName: r.testName,
      category: r.category || 'Web Frontend E2E',
      status: r.status,
      durationMs: r.durationMs,
      timestamp: r.timestamp,
      errorMessage: r.errorMessage || '',
      environment: 'Headless Chrome (Windows 11)'
    });

    if (r.status === 'PASS') {
      row.getCell('status').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'DCFCE7' }
      };
      row.getCell('status').font = { color: { argb: '166534' }, bold: true };
    } else {
      row.getCell('status').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FEE2E2' }
      };
      row.getCell('status').font = { color: { argb: '991B1B' }, bold: true };
    }
  });

  const filePath = path.join(reportsDir, 'selenium-report.xlsx');
  await workbook.xlsx.writeFile(filePath);
  return filePath;
}

module.exports = { recordTestResult, generateExcelReport, testResults };
