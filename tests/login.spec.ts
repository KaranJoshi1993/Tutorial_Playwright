import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import { LoginPageObject } from '../page-objects/loginPageObject';
import { email, password, wrongemail, wrongpassword } from '../utils/credentials';
import { LoginPageConstant, LoginPageAssertion } from '../page-constants/loginPageConstant';

let browser: Browser;
let context: BrowserContext;
let page: Page;
let loginPageObject: LoginPageObject;

test.beforeAll(async ({ browser: browserFromFixture }) => {
  browser = browserFromFixture;
  context = await browser.newContext();
  page = await context.newPage();
  loginPageObject = new LoginPageObject(page, context);
});

test.describe('Login Test Cases', () => {

  test('TC001 Should login successfully with valid credentials', async () => {
    await loginPageObject.navigateTo();
    await loginPageObject.enterEmail(email);
    await loginPageObject.enterPassword(password);
    await loginPageObject.clickLogin(page);
    await expect(page).toHaveURL(LoginPageAssertion.alertReportsListURL);
  });

  test('TC002 Should show error for invalid email format', async () => {
    await loginPageObject.navigateTo();
    await loginPageObject.enterEmail(wrongemail);
    await loginPageObject.enterPassword(password);
    await loginPageObject.clickLogin(page);

    await expect(page.locator(LoginPageConstant.errorMessage)).toBeVisible();
    await expect(page.locator(LoginPageConstant.errorMessage)).toContainText(LoginPageAssertion.microsoft);
  });

  test('TC003 Should show error for incorrect password', async () => {
    await loginPageObject.navigateTo();
    await loginPageObject.enterEmail(email);
    await loginPageObject.enterPassword(wrongpassword);
    await loginPageObject.clickLogin(page);

    await expect(page.locator(LoginPageConstant.errorMessage)).toBeVisible();
    await expect(page.locator(LoginPageConstant.errorMessage)).toContainText(LoginPageAssertion.microsoft);
  });

  test('TC004 Should show validation for empty email and password', async () => {
    await loginPageObject.navigateTo();
    await loginPageObject.clickLogin(page);

    await expect(page.locator(LoginPageConstant.emailError)).toBeVisible();
    await expect(page.locator(LoginPageConstant.passwordError)).toBeVisible();
  });
  
});

test.afterAll(async () => {
  await context.close();
});
