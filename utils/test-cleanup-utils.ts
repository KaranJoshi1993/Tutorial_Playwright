import { Page, BrowserContext } from '@playwright/test';

/**
 * Safely closes the browser context and pages, ensuring all downloads and streams are completed
 * @param page - The Playwright page object
 * @param context - The Playwright browser context
 */
export async function safeCleanup(page: Page, context: BrowserContext): Promise<void> {
    try {
        // Wait for any pending downloads to complete
        await page.waitForTimeout(2000);
        
        // Close all pages in the context first
        const pages = context.pages();
        for (const p of pages) {
            if (!p.isClosed()) {
                await p.close();
            }
        }
        
        // Wait a bit more to ensure all streams are closed
        await page.waitForTimeout(1000);
        
        // Finally close the context
        await context.close();
    } catch (error) {
        // Try to force close the context if it's still open
        try {
            await context.close();
        } catch (closeError) {
            // console.warn('Error force closing context:', closeError);
        }
    }
}

/**
 * Standard afterEach hook that can be used in test files that perform downloads or file operations
 * @param page - The Playwright page object
 * @param context - The Playwright browser context
 */
export const standardAfterEach = async ({ page, context }: { page: Page; context: BrowserContext }) => {
    await safeCleanup(page, context);
};
