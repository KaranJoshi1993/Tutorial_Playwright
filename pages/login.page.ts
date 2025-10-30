import { Page, expect } from '@playwright/test';
import { LOGIN_PAGE_SELECTORS } from '../locators/locators';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto(LOGIN_PAGE_SELECTORS.url);
  }

  async enterEmail(email: string) {
    await this.page.fill(LOGIN_PAGE_SELECTORS.emailInput, email);
  }

  async enterPassword(password: string) {
    await this.page.fill(LOGIN_PAGE_SELECTORS.passwordInput, password);
  }

  async clickLogin(page: Page) {
    await this.page.click(LOGIN_PAGE_SELECTORS.loginButton);
  }

}
