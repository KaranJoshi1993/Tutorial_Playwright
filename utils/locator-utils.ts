import { FrameLocator, Locator, Page } from "@playwright/test";

export class LocatorUtils {

    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async getLocator(input: string | Locator) {
        return typeof input === 'string' ? this.page.locator(input) : input;
    }

    async getAllLocator(input: string) {
        return this.page.locator(input).all();
    }

}