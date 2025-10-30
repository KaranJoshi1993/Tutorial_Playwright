import { Page } from '@playwright/test';

export default class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async click(locator: string): Promise<void> {
    await this.page.locator(locator).click();
  }

  async fill(locator: string, text: string): Promise<void> {
    await this.page.locator(locator).fill(text);
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }
}
