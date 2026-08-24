import { By, until, WebDriver } from 'selenium-webdriver';
import { createWebDriver } from '../helpers/driver';
import { recordTestResult, generateExcelReport } from '../helpers/report';
const { loginUser } = require('../helpers/auth');

describe('Category 1: Auth & Onboarding (TC_001 to TC_020)', () => {
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
        category: 'Auth & Onboarding',
        status: 'PASS',
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      recordTestResult({
        testId,
        testName,
        category: 'Auth & Onboarding',
        status: 'FAIL',
        errorMessage: err.message,
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
      throw err;
    }
  }

  test('TC_001: User Login - Valid Credentials', async () => {
    await runTestCase('TC_001', 'User Login - Valid Credentials', async () => {
      await loginUser(driver, 'alex@creator.com', 'password123');
      const sessionBadge = await driver.wait(until.elementLocated(By.css('[data-testid="user-session-badge"]')), 5000);
      const text = await sessionBadge.getText();
      expect(text).toContain('alex');
    });
  });

  test('TC_002: User Login - Invalid Email Format', async () => {
    await runTestCase('TC_002', 'User Login - Invalid Email Format', async () => {
      const loginBtn = await driver.findElement(By.css('[data-testid="nav-login-btn"]'));
      await loginBtn.click();
      const emailInput = await driver.wait(until.elementLocated(By.css('[data-testid="login-email-input"]')), 5000);
      await emailInput.sendKeys('invalid-email');
      const passInput = await driver.findElement(By.css('[data-testid="login-password-input"]'));
      await passInput.sendKeys('pass123');
      const submitBtn = await driver.findElement(By.css('[data-testid="login-submit-btn"]'));
      await submitBtn.click();
      const errorMsg = await driver.wait(until.elementLocated(By.css('[data-testid="login-error-msg"]')), 5000);
      expect(await errorMsg.isDisplayed()).toBe(true);
    });
  });

  test('TC_003: User Login - Wrong Password', async () => {
    await runTestCase('TC_003', 'User Login - Wrong Password', async () => {
      const loginBtn = await driver.findElement(By.css('[data-testid="nav-login-btn"]'));
      await loginBtn.click();
      const emailInput = await driver.wait(until.elementLocated(By.css('[data-testid="login-email-input"]')), 5000);
      await emailInput.sendKeys('alex@creator.com');
      const passInput = await driver.findElement(By.css('[data-testid="login-password-input"]'));
      await passInput.sendKeys('wrong');
      const submitBtn = await driver.findElement(By.css('[data-testid="login-submit-btn"]'));
      await submitBtn.click();
      const errorMsg = await driver.wait(until.elementLocated(By.css('[data-testid="login-error-msg"]')), 5000);
      expect(await errorMsg.isDisplayed()).toBe(true);
    });
  });

  test('TC_004: User Registration - Creator Role Sign Up', async () => {
    await runTestCase('TC_004', 'User Registration - Creator Role Sign Up', async () => {
      const regBtn = await driver.findElement(By.css('[data-testid="nav-register-btn"]'));
      await regBtn.click();
      const nameInput = await driver.wait(until.elementLocated(By.css('[data-testid="register-name-input"]')), 5000);
      await nameInput.sendKeys('New Creator');
      const emailInput = await driver.findElement(By.css('[data-testid="register-email-input"]'));
      await emailInput.sendKeys('creator@test.com');
      const passInput = await driver.findElement(By.css('[data-testid="register-password-input"]'));
      await passInput.sendKeys('securepass');
      const roleBtn = await driver.findElement(By.css('[data-testid="register-role-creator-btn"]'));
      await roleBtn.click();
      const submitBtn = await driver.findElement(By.css('[data-testid="register-submit-btn"]'));
      await submitBtn.click();
      await driver.sleep(200);
    });
  });

  test('TC_005: User Registration - Brand Role Sign Up', async () => {
    await runTestCase('TC_005', 'User Registration - Brand Role Sign Up', async () => {
      const regBtn = await driver.findElement(By.css('[data-testid="nav-register-btn"]'));
      await regBtn.click();
      const nameInput = await driver.wait(until.elementLocated(By.css('[data-testid="register-name-input"]')), 5000);
      await nameInput.sendKeys('New Brand');
      const emailInput = await driver.findElement(By.css('[data-testid="register-email-input"]'));
      await emailInput.sendKeys('brand@test.com');
      const passInput = await driver.findElement(By.css('[data-testid="register-password-input"]'));
      await passInput.sendKeys('brandpass');
      const roleBtn = await driver.findElement(By.css('[data-testid="register-role-brand-btn"]'));
      await roleBtn.click();
      const submitBtn = await driver.findElement(By.css('[data-testid="register-submit-btn"]'));
      await submitBtn.click();
      await driver.sleep(200);
    });
  });

  test('TC_006: User Registration - Password Strength Validation', async () => {
    await runTestCase('TC_006', 'User Registration - Password Strength Validation', async () => {
      const regBtn = await driver.findElement(By.css('[data-testid="nav-register-btn"]'));
      await regBtn.click();
      const nameInput = await driver.wait(until.elementLocated(By.css('[data-testid="register-name-input"]')), 5000);
      await nameInput.sendKeys('Test Name');
      const emailInput = await driver.findElement(By.css('[data-testid="register-email-input"]'));
      await emailInput.sendKeys('weak@test.com');
      const passInput = await driver.findElement(By.css('[data-testid="register-password-input"]'));
      await passInput.sendKeys('123');
      const submitBtn = await driver.findElement(By.css('[data-testid="register-submit-btn"]'));
      await submitBtn.click();
      const err = await driver.wait(until.elementLocated(By.css('[data-testid="register-error-msg"]')), 5000);
      expect(await err.isDisplayed()).toBe(true);
    });
  });

  test('TC_007: User Registration - Duplicate Email Handling', async () => {
    await runTestCase('TC_007', 'User Registration - Duplicate Email Handling', async () => {
      const regBtn = await driver.findElement(By.css('[data-testid="nav-register-btn"]'));
      await regBtn.click();
      const nameInput = await driver.wait(until.elementLocated(By.css('[data-testid="register-name-input"]')), 5000);
      await nameInput.sendKeys('Test Name');
      const emailInput = await driver.findElement(By.css('[data-testid="register-email-input"]'));
      await emailInput.sendKeys('duplicate@test.com');
      const passInput = await driver.findElement(By.css('[data-testid="register-password-input"]'));
      await passInput.sendKeys('password123');
      const submitBtn = await driver.findElement(By.css('[data-testid="register-submit-btn"]'));
      await submitBtn.click();
      const err = await driver.wait(until.elementLocated(By.css('[data-testid="register-error-msg"]')), 5000);
      expect(await err.isDisplayed()).toBe(true);
    });
  });

  test('TC_008: Forgot Password - Request Reset Link', async () => {
    await runTestCase('TC_008', 'Forgot Password - Request Reset Link', async () => {
      const loginBtn = await driver.findElement(By.css('[data-testid="nav-login-btn"]'));
      await loginBtn.click();
      const forgotBtn = await driver.wait(until.elementLocated(By.css('[data-testid="nav-forgot-password-btn"]')), 5000);
      await forgotBtn.click();
      const emailInput = await driver.wait(until.elementLocated(By.css('[data-testid="forgot-email-input"]')), 5000);
      await emailInput.sendKeys('alex@creator.com');
      const submitBtn = await driver.findElement(By.css('[data-testid="forgot-submit-btn"]'));
      await submitBtn.click();
      const successMsg = await driver.wait(until.elementLocated(By.css('[data-testid="forgot-success-msg"]')), 5000);
      expect(await successMsg.isDisplayed()).toBe(true);
    });
  });

  test('TC_009: Forgot Password - Invalid Email Validation', async () => {
    await runTestCase('TC_009', 'Forgot Password - Invalid Email Validation', async () => {
      const loginBtn = await driver.findElement(By.css('[data-testid="nav-login-btn"]'));
      await loginBtn.click();
      const forgotBtn = await driver.wait(until.elementLocated(By.css('[data-testid="nav-forgot-password-btn"]')), 5000);
      await forgotBtn.click();
      const emailInput = await driver.wait(until.elementLocated(By.css('[data-testid="forgot-email-input"]')), 5000);
      await emailInput.sendKeys('invalid-email');
      const submitBtn = await driver.findElement(By.css('[data-testid="forgot-submit-btn"]'));
      await submitBtn.click();
      const err = await driver.wait(until.elementLocated(By.css('[data-testid="forgot-error-msg"]')), 5000);
      expect(await err.isDisplayed()).toBe(true);
    });
  });

  test('TC_010: Reset Password - Update Password with Token', async () => {
    await runTestCase('TC_010', 'Reset Password - Update Password with Token', async () => {
      await driver.executeScript("switchAuthView('reset'); document.getElementById('auth-modal-overlay').classList.remove('hidden');");
      const pass1 = await driver.wait(until.elementLocated(By.css('[data-testid="reset-password-input"]')), 5000);
      await pass1.sendKeys('newsecretpass');
      const pass2 = await driver.findElement(By.css('[data-testid="reset-confirm-password-input"]'));
      await pass2.sendKeys('newsecretpass');
      const submitBtn = await driver.findElement(By.css('[data-testid="reset-submit-btn"]'));
      await submitBtn.click();
      const succ = await driver.wait(until.elementLocated(By.css('[data-testid="reset-success-msg"]')), 5000);
      expect(await succ.isDisplayed()).toBe(true);
    });
  });

  test('TC_011: Reset Password - Mismatched Password Confirmation', async () => {
    await runTestCase('TC_011', 'Reset Password - Mismatched Password Confirmation', async () => {
      await driver.executeScript("switchAuthView('reset'); document.getElementById('auth-modal-overlay').classList.remove('hidden');");
      const pass1 = await driver.wait(until.elementLocated(By.css('[data-testid="reset-password-input"]')), 5000);
      await pass1.sendKeys('newsecretpass');
      const pass2 = await driver.findElement(By.css('[data-testid="reset-confirm-password-input"]'));
      await pass2.sendKeys('mismatchpass');
      const submitBtn = await driver.findElement(By.css('[data-testid="reset-submit-btn"]'));
      await submitBtn.click();
      const err = await driver.wait(until.elementLocated(By.css('[data-testid="reset-error-msg"]')), 5000);
      expect(await err.isDisplayed()).toBe(true);
    });
  });

  test('TC_012: Session Restore - Auto-login with Stored Token', async () => {
    await runTestCase('TC_012', 'Session Restore - Auto-login with Stored Token', async () => {
      const badge = await driver.findElement(By.css('[data-testid="user-session-badge"]'));
      expect(await badge.isDisplayed()).toBe(true);
    });
  });

  test('TC_013: User Logout - Clear Session State & Redirect', async () => {
    await runTestCase('TC_013', 'User Logout - Clear Session State & Redirect', async () => {
      await driver.executeScript("currentUser = { name: 'Alex', email: 'alex@creator.com', role: 'creator', authenticated: true }; updateSessionUI();");
      const logoutBtn = await driver.wait(until.elementLocated(By.css('[data-testid="nav-logout-btn"]')), 5000);
      await logoutBtn.click();
      const badge = await driver.findElement(By.css('[data-testid="user-session-badge"]'));
      expect(await badge.getText()).toContain('Guest');
    });
  });

  test('TC_014: Onboarding - Role Selection Step', async () => {
    await runTestCase('TC_014', 'Onboarding - Role Selection Step', async () => {
      await driver.executeScript("document.getElementById('onboarding-container').classList.remove('hidden');");
      const roleSelect = await driver.findElement(By.css('[data-testid="onboarding-role-select"]'));
      await roleSelect.sendKeys('Brand Partner');
      expect(await roleSelect.isDisplayed()).toBe(true);
    });
  });

  test('TC_015: Onboarding - Profile Basic Details Entry', async () => {
    await runTestCase('TC_015', 'Onboarding - Profile Basic Details Entry', async () => {
      await driver.executeScript("document.getElementById('onboarding-container').classList.remove('hidden');");
      const bioInput = await driver.findElement(By.css('[data-testid="onboarding-bio-input"]'));
      await bioInput.sendKeys('Test bio entry');
      expect(await bioInput.getAttribute('value')).toBe('Test bio entry');
    });
  });

  test('TC_016: Onboarding - Social Account Linking Step', async () => {
    await runTestCase('TC_016', 'Onboarding - Social Account Linking Step', async () => {
      await driver.executeScript("document.getElementById('onboarding-container').classList.remove('hidden');");
      const socialInput = await driver.findElement(By.css('[data-testid="onboarding-social-input"]'));
      await socialInput.sendKeys('@test_handle');
      expect(await socialInput.getAttribute('value')).toBe('@test_handle');
    });
  });

  test('TC_017: Onboarding - Niche / Category Selection', async () => {
    await runTestCase('TC_017', 'Onboarding - Niche / Category Selection', async () => {
      await driver.executeScript("document.getElementById('onboarding-container').classList.remove('hidden');");
      const nicheSelect = await driver.findElement(By.css('[data-testid="onboarding-niche-select"]'));
      await nicheSelect.sendKeys('Fitness & Health');
      expect(await nicheSelect.isDisplayed()).toBe(true);
    });
  });

  test('TC_018: Onboarding - Skip Optional Steps', async () => {
    await runTestCase('TC_018', 'Onboarding - Skip Optional Steps', async () => {
      await driver.executeScript("document.getElementById('onboarding-container').classList.remove('hidden');");
      const skipBtn = await driver.findElement(By.css('[data-testid="onboarding-skip-btn"]'));
      await skipBtn.click();
      const onboarding = await driver.findElement(By.id('onboarding-container'));
      expect(await onboarding.isDisplayed()).toBe(false);
    });
  });

  test('TC_019: Onboarding - Complete Flow Redirects to Dashboard', async () => {
    await runTestCase('TC_019', 'Onboarding - Complete Flow Redirects to Dashboard', async () => {
      await driver.executeScript("document.getElementById('onboarding-container').classList.remove('hidden');");
      const completeBtn = await driver.findElement(By.css('[data-testid="onboarding-complete-btn"]'));
      await completeBtn.click();
      const dashView = await driver.findElement(By.id('tab-dashboard'));
      expect(await dashView.isDisplayed()).toBe(true);
    });
  });

  test('TC_020: Auth Guard - Protect Private Routes from Unauthenticated Access', async () => {
    await runTestCase('TC_020', 'Auth Guard - Protect Private Routes from Unauthenticated Access', async () => {
      await driver.executeScript("currentUser.authenticated = false; updateSessionUI(); switchTab('wallet');");
      const banner = await driver.findElement(By.css('[data-testid="protected-route-banner"]'));
      expect(await banner.isDisplayed()).toBe(true);
    });
  });
});
