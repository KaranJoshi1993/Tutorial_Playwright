import { Browser, BrowserContext, Page } from "@playwright/test";
import { SMALL_TIMEOUT } from "./timeout-constants";
import { ta } from "date-fns/locale";

export class PageUtils {

  page: Page;
  context: BrowserContext;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
  }

  setPage(page: Page) {
    this.page = page;
  }

  /**
   * Switches to a different page by its index (1-based).
   * If the desired page isn't immediately available, this  will wait and retry for up to 'SMALL_TIMEOUT' seconds.
   * @param {number} winNum - The index of the page to switch to.
   * @throws {Error} If the desired page isn't found within 'SMALL_TIMEOUT' seconds.
   */
  /**
 * Switches to a different page by its index (1-based).
 * If the desired page isn't immediately available, this function will wait and retry for up to 'SMALL_TIMEOUT' seconds.
 * @param {number} winNum - The index of the page to switch to.
 * @throws {Error} If the desired page isn't found within 'SMALL_TIMEOUT' seconds.
 */
  async switchPage(winNum: number): Promise<Page> {
    const startTime = Date.now();
    const maxWaitTime = SMALL_TIMEOUT;

    // Wait until the desired number of pages are opened
    while (this.page.context().pages().length < winNum && Date.now() - startTime < maxWaitTime) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (this.page.context().pages().length < winNum) {
      throw new Error(`Page number ${winNum} not found after ${maxWaitTime / 1000} seconds`);
    }

    // List all pages and URLs
    const allPages = this.page.context().pages();
    const index = 1;
    const pageInstance = allPages[winNum - 1];

    // Wait for the page to be fully loaded
    await pageInstance.waitForLoadState('load');

    // Bring the page to the front
    await pageInstance.bringToFront();
    await pageInstance.waitForTimeout(1000);
    return pageInstance;
  }

  async switchAndReinitialize(index: number, pageObjects: Record<string, any>): Promise<Record<string, any>> {
    const pages = this.page.context().pages();
    if (index < 0 || index >= pages.length) {
      throw new Error(`Invalid tab index: ${index}. Only ${pages.length} tabs are open.`);
    }

    const targetPage = pages[index];
    await targetPage.bringToFront();

    // Reinitialize all page objects
    const updatedPageObjects: Record<string, any> = {};
    for (const [key, PageObjectClass] of Object.entries(pageObjects)) {
      updatedPageObjects[key] = new PageObjectClass(targetPage, targetPage.context());
    }

    return updatedPageObjects;
  }

  async switchToNewPage(): Promise<Page> {
    const pages = this.page.context().pages();
    const index = 1;
    const newPage = pages[pages.length - 1];
    await newPage.bringToFront();
    return newPage;
  }


  /**
   * Switches back to the default page (the first one).
   */
  async switchToDefaultPage(): Promise<Page> {
    const pageInstance = this.page.context().pages()[0];
    if (pageInstance) {
      await pageInstance.bringToFront();
      return pageInstance;
    }
    return this.page;
  }

  /**
   * Closes a page by its index (1-based).
   * If no index is provided, the current page is closed.
   * If there are other pages open, it will switch back to the default page.
   * @param {number} winNum - The index of the page to close.
   */
  async closePage(winNum: number): Promise<void> {
    if (!winNum) {
      await this.page.close();
      return;
    }
    const noOfWindows = this.page.context().pages().length;
    const pageInstance = this.page.context().pages()[winNum - 1];
    await pageInstance.close();
    if (noOfWindows > 1) {
      await this.switchToDefaultPage();
    }
  }

  async isHeadless(): Promise<boolean> {
    const userAgent = await this.page.evaluate(() => navigator.userAgent);
    const isHeadless = userAgent.includes('Headless');
    return isHeadless;
  }

}