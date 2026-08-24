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

  // 1. SUMMARY SHEET
  const summarySheet = workbook.addWorksheet('Summary');
  summarySheet.columns = [
    { header: 'Metric', key: 'metric', width: 32 },
    { header: 'Value', key: 'value', width: 28 }
  ];

  const total = testResults.length;
  const passed = testResults.filter(r => r.status === 'PASS').length;
  const failed = testResults.filter(r => r.status === 'FAIL').length;
  const totalDuration = testResults.reduce((acc, r) => acc + (r.durationMs || 0), 0);

  summarySheet.addRows([
    { metric: 'Total Appium Tests Executed', value: total },
    { metric: 'Passed Test Cases', value: passed },
    { metric: 'Failed Test Cases', value: failed },
    { metric: 'Pass Rate (%)', value: total > 0 ? `${((passed / total) * 100).toFixed(2)}%` : '0%' },
    { metric: 'Total Execution Duration (ms)', value: totalDuration },
    { metric: 'Target Platform', value: 'Appium Android / iOS Mobile Frontend' },
    { metric: 'Execution Date', value: new Date().toISOString() }
  ]);

  summarySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
  summarySheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '4F46E5' }
  };

  // 2. APPIUM TEST RESULTS SHEET (Exact format matching Selenium report)
  const detailsSheet = workbook.addWorksheet('Appium Test Results');
  detailsSheet.columns = [
    { header: 'Test ID', key: 'testId', width: 12 },
    { header: 'Test Name', key: 'testName', width: 50 },
    { header: 'Category', key: 'category', width: 32 },
    { header: 'Status', key: 'status', width: 12 },
    { header: 'Error Message', key: 'errorMessage', width: 40 },
    { header: 'Duration (ms)', key: 'durationMs', width: 18 },
    { header: 'Timestamp', key: 'timestamp', width: 28 },
    { header: 'Screenshot path', key: 'screenshotPath', width: 30 }
  ];

  detailsSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
  detailsSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '1E1B4B' }
  };

  testResults.forEach(r => {
    const row = detailsSheet.addRow({
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
      statusCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'DCFCE7' }
      };
      statusCell.font = { color: { argb: '15803D' }, bold: true };
    } else {
      statusCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FEE2E2' }
      };
      statusCell.font = { color: { argb: 'B91C1C' }, bold: true };
    }
  });

  const filePath = path.join(reportsDir, 'appium-report.xlsx');
  await workbook.xlsx.writeFile(filePath);
  return filePath;
}

module.exports = { recordTestResult, generateExcelReport, testResults };
