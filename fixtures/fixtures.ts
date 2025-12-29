import { test as base, BrowserContext, Page } from '@playwright/test';
import { LoginPageObject } from '../page-objects/loginPageObject';
import { email, password } from '../utils/credentials';
import { LoginPageAssertion } from '../page-constants/loginPageConstant';

type MyFixtures = {
  page: Page;
};

export const test = base.extend<MyFixtures>({
  page: async ({ browser }, use) => {
    const context: BrowserContext = await browser.newContext();
    const page: Page = await context.newPage();

    const loginPageObject = new LoginPageObject(page, context);

    await loginPageObject.navigateTo();
    await loginPageObject.enterEmail(email);
    await loginPageObject.enterPassword(password);
    await loginPageObject.clickLogin(page);
    await page.waitForURL(LoginPageAssertion.alertReportsListURL);

    await use(page);

    await context.close();
  },
});

export { expect } from '@playwright/test';
