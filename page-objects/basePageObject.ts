import { Page, expect } from '@playwright/test';

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

  /**
   * Generic method to hover over a parent element and click a visible child/submenu item.
   * @param parentSelector - The selector for the parent/hover element.
   * @param childSelector - The selector for the submenu or nested element to click.
   */
  async hoverAndClick(parentSelector: string, childSelector: string) {
    const parent = this.page.locator(parentSelector);
    const child = this.page.locator(childSelector);

    await parent.hover();
    await expect(child).toBeVisible({ timeout: 5000 });
    await child.click();
  }
}
