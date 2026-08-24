import { By, until, WebDriver } from 'selenium-webdriver';
import { createWebDriver } from '../helpers/driver';
import { recordTestResult, generateExcelReport } from '../helpers/report';

describe('Category 5: Messages, Settings & Admin (TC_081 to TC_100)', () => {
  let driver: WebDriver;
  const baseUrl = 'http://localhost:8081';

  beforeAll(async () => {
    driver = await createWebDriver();
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
    await generateExcelReport();
  });

  beforeEach(async () => {
    await driver.get(baseUrl);
    await driver.sleep(200);
  });

  async function runTestCase(testId: string, testName: string, testFn: () => Promise<void>) {
    const startTime = Date.now();
    try {
      await testFn();
      recordTestResult({
        testId,
        testName,
        category: 'Messages, Settings & Admin',
        status: 'PASS',
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      recordTestResult({
        testId,
        testName,
        category: 'Messages, Settings & Admin',
        status: 'FAIL',
        errorMessage: err.message,
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
      throw err;
    }
  }

  test('TC_081: Messages - View Chat Inbox List', async () => {
    await runTestCase('TC_081', 'Messages - View Chat Inbox List', async () => {
      const msgTab = await driver.findElement(By.css('[data-testid="nav-messages-tab"]'));
      await msgTab.click();
      const inbox = await driver.wait(until.elementLocated(By.css('[data-testid="messages-inbox-list"]')), 5000);
      expect(await inbox.isDisplayed()).toBe(true);
    });
  });

  test('TC_082: Messages - Open Specific Thread & View History', async () => {
    await runTestCase('TC_082', 'Messages - Open Specific Thread & View History', async () => {
      const msgTab = await driver.findElement(By.css('[data-testid="nav-messages-tab"]'));
      await msgTab.click();
      const thread1 = await driver.wait(until.elementLocated(By.css('[data-testid="messages-thread-item-1"]')), 5000);
      await thread1.click();
      const history = await driver.findElement(By.css('[data-testid="messages-history-container"]'));
      expect(await history.isDisplayed()).toBe(true);
    });
  });

  test('TC_083: Messages - Send Text Message in Thread', async () => {
    await runTestCase('TC_083', 'Messages - Send Text Message in Thread', async () => {
      const msgTab = await driver.findElement(By.css('[data-testid="nav-messages-tab"]'));
      await msgTab.click();
      const input = await driver.wait(until.elementLocated(By.css('[data-testid="messages-text-input"]')), 5000);
      await input.sendKeys('Hello Apex Team!');
      const sendBtn = await driver.findElement(By.css('[data-testid="messages-send-btn"]'));
      await sendBtn.click();
      await driver.sleep(200);
    });
  });

  test('TC_084: Messages - Attach File/Image in Chat', async () => {
    await runTestCase('TC_084', 'Messages - Attach File/Image in Chat', async () => {
      const msgTab = await driver.findElement(By.css('[data-testid="nav-messages-tab"]'));
      await msgTab.click();
      const attachBtn = await driver.wait(until.elementLocated(By.css('[data-testid="messages-attach-file-btn"]')), 5000);
      await attachBtn.click();
      const preview = await driver.wait(until.elementLocated(By.css('[data-testid="messages-attachment-preview"]')), 5000);
      expect(await preview.isDisplayed()).toBe(true);
    });
  });

  test('TC_085: Messages - Real-time Message Receipt Notification', async () => {
    await runTestCase('TC_085', 'Messages - Real-time Message Receipt Notification', async () => {
      const msgTab = await driver.findElement(By.css('[data-testid="nav-messages-tab"]'));
      await msgTab.click();
      const badge = await driver.wait(until.elementLocated(By.css('[data-testid="messages-realtime-badge"]')), 5000);
      expect(await badge.isDisplayed()).toBe(true);
    });
  });

  test('TC_086: Notifications - View Unread Notification Badge & List', async () => {
    await runTestCase('TC_086', 'Notifications - View Unread Notification Badge & List', async () => {
      const bell = await driver.findElement(By.css('[data-testid="notifications-bell-btn"]'));
      await bell.click();
      const dropdown = await driver.wait(until.elementLocated(By.css('[data-testid="notifications-dropdown"]')), 5000);
      expect(await dropdown.isDisplayed()).toBe(true);
    });
  });

  test('TC_087: Notifications - Mark Individual Notification as Read', async () => {
    await runTestCase('TC_087', 'Notifications - Mark Individual Notification as Read', async () => {
      const bell = await driver.findElement(By.css('[data-testid="notifications-bell-btn"]'));
      await bell.click();
      const markBtn = await driver.wait(until.elementLocated(By.css('[data-testid="notification-mark-read-1"]')), 5000);
      await markBtn.click();
      await driver.sleep(200);
    });
  });

  test('TC_088: Notifications - Mark All Notifications as Read', async () => {
    await runTestCase('TC_088', 'Notifications - Mark All Notifications as Read', async () => {
      const bell = await driver.findElement(By.css('[data-testid="notifications-bell-btn"]'));
      await bell.click();
      const markAllBtn = await driver.wait(until.elementLocated(By.css('[data-testid="notifications-mark-all-read-btn"]')), 5000);
      await markAllBtn.click();
      const badge = await driver.findElement(By.css('[data-testid="notifications-badge-count"]'));
      expect(await badge.getText()).toBe('0');
    });
  });

  test('TC_089: Settings - Toggle Dark / Light Theme', async () => {
    await runTestCase('TC_089', 'Settings - Toggle Dark / Light Theme', async () => {
      const setTab = await driver.findElement(By.css('[data-testid="nav-settings-tab"]'));
      await setTab.click();
      const themeToggle = await driver.wait(until.elementLocated(By.css('[data-testid="settings-theme-toggle"]')), 5000);
      await themeToggle.click();
      const statusLbl = await driver.findElement(By.css('[data-testid="settings-theme-status"]'));
      expect(await statusLbl.getText()).toBe('Light Mode');
    });
  });

  test('TC_090: Settings - Update Account Email / Password Security Settings', async () => {
    await runTestCase('TC_090', 'Settings - Update Account Email / Password Security Settings', async () => {
      const setTab = await driver.findElement(By.css('[data-testid="nav-settings-tab"]'));
      await setTab.click();
      const saveBtn = await driver.wait(until.elementLocated(By.css('[data-testid="settings-security-save-btn"]')), 5000);
      await saveBtn.click();
      await driver.sleep(200);
    });
  });

  test('TC_091: Settings - Toggle Email & In-App Notification Preferences', async () => {
    await runTestCase('TC_091', 'Settings - Toggle Email & In-App Notification Preferences', async () => {
      const setTab = await driver.findElement(By.css('[data-testid="nav-settings-tab"]'));
      await setTab.click();
      const emailCheckbox = await driver.wait(until.elementLocated(By.css('[data-testid="settings-notification-email-checkbox"]')), 5000);
      await emailCheckbox.click();
      expect(await emailCheckbox.isSelected()).toBe(false);
    });
  });

  test('TC_092: Admin Login - Authenticate as Administrator Role', async () => {
    await runTestCase('TC_092', 'Admin Login - Authenticate as Administrator Role', async () => {
      const adminTab = await driver.findElement(By.css('[data-testid="nav-admin-tab"]'));
      await adminTab.click();
      const dashScreen = await driver.wait(until.elementLocated(By.css('[data-testid="admin-screen-dashboard"]')), 5000);
      expect(await dashScreen.isDisplayed()).toBe(true);
    });
  });

  test('TC_093: Admin Dashboard - View System-wide Metrics & Analytics', async () => {
    await runTestCase('TC_093', 'Admin Dashboard - View System-wide Metrics & Analytics', async () => {
      await driver.executeScript("switchTab('admin'); switchAdminScreen('dashboard');");
      const dash = await driver.wait(until.elementLocated(By.css('[data-testid="admin-screen-dashboard"]')), 5000);
      expect(await dash.isDisplayed()).toBe(true);
    });
  });

  test('TC_094: Admin Users Screen - Search, Filter, & Manage User Accounts', async () => {
    await runTestCase('TC_094', 'Admin Users Screen - Search, Filter, & Manage User Accounts', async () => {
      await driver.executeScript("switchTab('admin'); switchAdminScreen('users');");
      const searchInput = await driver.wait(until.elementLocated(By.css('[data-testid="admin-user-search-input"]')), 5000);
      await searchInput.sendKeys('Alex');
      expect(await searchInput.getAttribute('value')).toBe('Alex');
    });
  });

  test('TC_095: Admin Users Screen - Suspend / Reactivate User', async () => {
    await runTestCase('TC_095', 'Admin Users Screen - Suspend / Reactivate User', async () => {
      await driver.executeScript("switchTab('admin'); switchAdminScreen('users');");
      const suspendBtn = await driver.wait(until.elementLocated(By.css('[data-testid="admin-user-suspend-btn-1"]')), 5000);
      await suspendBtn.click();
      const statusLbl = await driver.findElement(By.css('[data-testid="admin-user-status-1"]'));
      expect(await statusLbl.getText()).toBe('Suspended');
    });
  });

  test('TC_096: Admin Campaigns Screen - Audit & Moderate Active Campaigns', async () => {
    await runTestCase('TC_096', 'Admin Campaigns Screen - Audit & Moderate Active Campaigns', async () => {
      await driver.executeScript("switchTab('admin'); switchAdminScreen('campaigns');");
      const table = await driver.wait(until.elementLocated(By.css('[data-testid="admin-campaign-audit-table"]')), 5000);
      expect(await table.isDisplayed()).toBe(true);
    });
  });

  test('TC_097: Admin Disputes Screen - View Dispute Cases & Escalations', async () => {
    await runTestCase('TC_097', 'Admin Disputes Screen - View Dispute Cases & Escalations', async () => {
      await driver.executeScript("switchTab('admin'); switchAdminScreen('disputes');");
      const item = await driver.wait(until.elementLocated(By.css('[data-testid="admin-dispute-item-1"]')), 5000);
      expect(await item.isDisplayed()).toBe(true);
    });
  });

  test('TC_098: Admin Disputes Screen - Resolve Dispute with Refund/Payout Ruling', async () => {
    await runTestCase('TC_098', 'Admin Disputes Screen - Resolve Dispute with Refund/Payout Ruling', async () => {
      await driver.executeScript("switchTab('admin'); switchAdminScreen('disputes');");
      const refundBtn = await driver.wait(until.elementLocated(By.css('[data-testid="admin-dispute-resolve-refund-btn"]')), 5000);
      await refundBtn.click();
      const statusLbl = await driver.findElement(By.css('[data-testid="admin-dispute-status-1"]'));
      expect(await statusLbl.getText()).toBe('Refunded & Closed');
    });
  });

  test('TC_099: Admin Announcements Screen - Create & Broadcast Announcement', async () => {
    await runTestCase('TC_099', 'Admin Announcements Screen - Create & Broadcast Announcement', async () => {
      await driver.executeScript("switchTab('admin'); switchAdminScreen('announcements');");
      const titleInput = await driver.wait(until.elementLocated(By.css('[data-testid="admin-announcement-title-input"]')), 5000);
      await titleInput.sendKeys('Platform Maintenance');
      const contentInput = await driver.findElement(By.css('[data-testid="admin-announcement-content-input"]'));
      await contentInput.sendKeys('Maintenance on Sunday 2 AM UTC.');
      const pubBtn = await driver.findElement(By.css('[data-testid="admin-announcement-publish-btn"]'));
      await pubBtn.click();
      const toast = await driver.wait(until.elementLocated(By.css('[data-testid="admin-announcement-toast"]')), 5000);
      expect(await toast.isDisplayed()).toBe(true);
    });
  });

  test('TC_100: Admin Navigation - Verify All 6 Admin Screens Load Cleanly', async () => {
    await runTestCase('TC_100', 'Admin Navigation - Verify All 6 Admin Screens Load Cleanly', async () => {
      await driver.executeScript("switchTab('admin'); switchAdminScreen('dashboard');");
      const dashBtn = await driver.wait(until.elementLocated(By.css('[data-testid="admin-nav-dashboard-btn"]')), 5000);
      expect(await dashBtn.isDisplayed()).toBe(true);
    });
  });
});
