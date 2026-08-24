const { By, until } = require('selenium-webdriver');

async function loginUser(driver, email = 'alex@creator.com', password = 'password123') {
  await driver.get('http://localhost:8081');
  const loginNavBtn = await driver.wait(until.elementLocated(By.css('[data-testid="nav-login-btn"]')), 5000);
  await loginNavBtn.click();

  const emailInput = await driver.wait(until.elementLocated(By.css('[data-testid="login-email-input"]')), 5000);
  const passwordInput = await driver.findElement(By.css('[data-testid="login-password-input"]'));
  const submitBtn = await driver.findElement(By.css('[data-testid="login-submit-btn"]'));

  await emailInput.clear();
  await emailInput.sendKeys(email);
  await passwordInput.clear();
  await passwordInput.sendKeys(password);
  await submitBtn.click();
  
  await driver.sleep(500);
}

module.exports = { loginUser };
