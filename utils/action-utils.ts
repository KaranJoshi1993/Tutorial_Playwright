import test, { BrowserContext, Dialog, Locator, Page } from "@playwright/test";
import { CheckOptions, ClearOptions, ClickOptions, DoubleClickOptions, DragOptions, FillOptions, GotoOptions, HoverOptions, NavigationOptions, SelectOptions, TimeoutOption, TypeOptions, UploadOptions, UploadValues, WaitForLoadStateOptions } from "./optional-parameter-types";
import { LocatorUtils } from "./locator-utils";
import { LOADSTATE } from "../playwright.config";
import { STANDARD_TIMEOUT, WAIT_FOR_NET_IDLE_TIMEOUT, WAIT_FOR_LOAD_STATE_TIMEOUT, MAX_TIMEOUT, BIG_TIMEOUT } from "./timeout-constants";
import * as FileUtils from '../utils/file-utils';


export class ActionUtils {
    page: Page;
    context: BrowserContext;
    locatorUtils: LocatorUtils;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        this.locatorUtils = new LocatorUtils(page);
    }

    setPage(page: Page) {
        this.page = page;
    }

    /**
     * 1. Navigations: This section contains s for navigating within a web page or between web pages.
     * These s include going to a URL, waiting for a page to load, reloading a page, and going back to a previous page.
     */

    /**
     * Navigates to the specified URL.
     * @param {string} path - The URL to navigate to.
     * @param {GotoOptions} options - The navigation options.
     * @returns {Promise<null | Response>} - The navigation response or null if no response.
     */
    async gotoURL(path: string, options: GotoOptions = { waitUntil: LOADSTATE }): Promise<void> {
        await this.page.goto(path, options);

        // Use enhanced page load waiting after navigation
        await this.waitForPageToFullyLoad();
    }

    async setViewPortSize(width: number, height: number) {
        await this.page.setViewportSize({ width: width, height: height });
    }

    async waitForUrl(url: string | RegExp) {
        await this.page.waitForURL(url);
    }

    /**
     * Waits for a specific page load state.
     * @param {NavigationOptions} options - The navigation options.
     */
    async waitForPageLoadState(options?: NavigationOptions): Promise<void> {
        let waitUntil: WaitForLoadStateOptions = LOADSTATE;

        if (options?.waitUntil && options.waitUntil !== 'commit') {
            waitUntil = options.waitUntil;
        }

        await this.page.waitForLoadState(waitUntil);
    }

    /**
     * Waits for the page to load and the network to be idle.
     * This method is useful for ensuring that all resources are loaded before proceeding.
     */

    async waitForLoad(timeout: number = MAX_TIMEOUT): Promise<void> {
        await test.step('Wait for page load', async () => {
            await this.waitForPageToFullyLoad(timeout);
        });
    }

    /**
     * Reloads the current page.
     * @param {NavigationOptions} options - The navigation options.
     */
    async reloadPage(options?: NavigationOptions): Promise<void> {
        await test.step('Reload page', async () => {
            await Promise.all([this.page.reload(options), this.page.waitForEvent('framenavigated')]);
            await this.waitForLoad();
            await this.waitForLoad();
        });
    }

    /**
     * Navigates back to the previous page.
     * @param {NavigationOptions} options - The navigation options.
     */
    async goBack(options?: NavigationOptions): Promise<void> {
        await Promise.all([this.page.goBack(options), this.page.waitForEvent('framenavigated')]);
        await this.waitForLoad();
    }

    /**
     * Waits for a specified amount of time.
     * @param {number} ms - The amount of time to wait in milliseconds.
     */
    async wait(ms: number): Promise<void> {
        // eslint-disable-next-line playwright/no-wait-for-timeout
        await this.page.waitForTimeout(ms);
    }

    /**
     * 2. Actions: This section contains s for interacting with elements on a web page.
     * These s include clicking, filling input fields, typing, clearing input fields, checking and unchecking checkboxes, selecting options in dropdowns, and more.
     */

    /**
     * Clicks on a specified element.
     * @param {string | Locator} input - The element to click on.
     * @param {ClickOptions} options - The click options.
     */
    async click(input: string | Locator, options?: ClickOptions): Promise<void> {
        const locator = await this.locatorUtils.getLocator(input);
        await this.waitUntilLocatorVisible(locator);
        await locator.click(options);
    }

    /**
     * Clicks on a specified element and waits for navigation.
     * @param {string | Locator} input - The element to click on.
     * @param {ClickOptions} options - The click options.
     */
    async clickAndNavigate(input: string | Locator, options?: ClickOptions): Promise<void> {
        const timeout = options?.timeout || STANDARD_TIMEOUT;
        await Promise.all([this.click(input, options), this.page.waitForEvent('framenavigated', { timeout: timeout })]);

        // Use enhanced page load waiting after navigation
        await this.waitForPageToFullyLoad();
    }

    /**
     * Enhanced click that automatically waits for the action to complete
     * Use this for clicks that trigger data loading, navigation, or CRUD operations
     */
    async clickAndWait(input: string | Locator, options?: ClickOptions, waitTimeout: number = 15000): Promise<void> {
        await this.click(input, options);
        await this.waitForActionToComplete(waitTimeout);
    }

    /**
     * Enhanced navigation that automatically waits for the page and any API calls to complete
     */
    async gotoAndWait(path: string, gotoOptions?: any, waitTimeout: number = 15000): Promise<void> {
        await this.gotoURL(path, gotoOptions);
        await this.waitForActionToComplete(waitTimeout);
    }

    /**
     * Fills a specified element with a value.
     * @param {string | Locator} input - The element to fill.
     * @param {string} value - The value to fill the element with.
     * @param {FillOptions} options - The fill options.
     */
    async fill(input: string | Locator, value: string, options?: FillOptions): Promise<void> {
        const locator = await this.locatorUtils.getLocator(input);
        await this.waitUntilLocatorVisible(locator);
        // await locator.scrollIntoViewIfNeeded();
        await locator.clear();
        await locator.fill(value, options);
    }

    async fillWithDelay(input: string | Locator, value: string, delay: number): Promise<void> {
        const locator = await this.locatorUtils.getLocator(input);
        await this.waitUntilLocatorVisible(locator);
        // await locator.scrollIntoViewIfNeeded();
        await locator.clear();
        await this.click(locator);
        await this.page.keyboard.type(value, { delay: delay });
    }

    /**
     * Fills a specified element with a value and press Enter.
     * @param {string | Locator} input - The element to fill.
     * @param {string} value - The value to fill the element with.
     * @param {FillOptions} options - The fill options.
     */
    async fillAndEnter(input: string | Locator, value: string, options?: FillOptions): Promise<void> {
        const locator = await this.locatorUtils.getLocator(input);
        await this.waitUntilLocatorVisible(locator);
        // await locator.scrollIntoViewIfNeeded();
        await locator.fill(value, options);
        await locator.press('Enter');
    }

    /**
     * Clears the value of a specified element.
     * @param {string | Locator} input - The element to clear.
     * @param {ClearOptions} options - The clear options.
     */
    async clear(input: string | Locator, options?: ClearOptions): Promise<void> {
        const locator = await this.locatorUtils.getLocator(input);
        await this.waitUntilLocatorVisible(locator);
        await locator.clear(options);
    }

    /**
     * Checks a specified checkbox or radio button.
     * @param {string | Locator} input - The checkbox or radio button to check.
     * @param {CheckOptions} options - The check options.
     */
    async check(input: string | Locator, options?: CheckOptions): Promise<void> {
        const locator = await this.locatorUtils.getLocator(input);
        await this.waitUntilLocatorVisible(locator);
        await locator.check(options);
    }

    /**
     * Unchecks a specified checkbox or radio button.
     * @param {string | Locator} input - The checkbox or radio button to uncheck.
     * @param {CheckOptions} options - The uncheck options.
     */
    async uncheck(input: string | Locator, options?: CheckOptions): Promise<void> {
        const locator = await this.locatorUtils.getLocator(input);
        await this.waitUntilLocatorVisible(locator);
        await locator.uncheck(options);
    }

    /**
     * Selects an option in a dropdown by its value.
     * @param {string | Locator} input - The dropdown to select an option in.
     * @param {string} value - The value of the option to select.
     * @param {SelectOptions} options - The select options.
     */
    async selectByValue(input: string | Locator, value: string, options?: SelectOptions): Promise<void> {
        const locator = await this.locatorUtils.getLocator(input);
        await locator.selectOption({ value: value }, options);
    }

    /**
     * Selects options in a dropdown by their values (multi select).
     * @param {string | Locator} input - The dropdown to select options in.
     * @param {Array<string>} value - The values of the options to select.
     * @param {SelectOptions} options - The select options.
     */
    async selectByValues(
        input: string | Locator,
        value: Array<string>,
        options?: SelectOptions,
    ): Promise<void> {
        const locator = await this.locatorUtils.getLocator(input);
        await locator.selectOption(value, options);
    }

    /**
     * Selects an option in a dropdown by its text.
     * @param {string | Locator} input - The dropdown to select an option in.
     * @param {string} text - The text of the option to select.
     * @param {SelectOptions} options - The select options.
     */
    async selectByText(input: string | Locator, text: string, options?: SelectOptions): Promise<void> {
        const locator = await this.locatorUtils.getLocator(input);
        await this.waitUntilLocatorVisible(locator);
        await locator.selectOption({ label: text }, options);
    }

    /**
     * Selects the first option in a dropdown that matches the given text.
     * @param {string | Locator} input - The dropdown to select an option in.
     * @param {string} text - The text to match.
     * @param {SelectOptions} options - The select options.
     */
    async selectByTextContains(input: string | Locator, text: string, options?: SelectOptions): Promise<void> {
        const locator = await this.locatorUtils.getLocator(input);
        await this.waitUntilLocatorVisible(locator);
        // Get all option elements
        const optionLocators = locator.locator('option');
        const count = await optionLocators.count();
        for (let i = 0; i < count; i++) {
            const option = optionLocators.nth(i);
            const optionText = await option.textContent();
            if (optionText && optionText.includes(text)) {
                const value = await option.getAttribute('value');
                if (value) {
                    await locator.selectOption({ value }, options);
                    return;
                }
            }
        }
        throw new Error(`No dropdown option containing text: '${text}' found.`);
    }


    /**
     * Selects an option in a dropdown by its index.
     * @param {string | Locator} input - The dropdown to select an option in.
     * @param {number} index - The index of the option to select.
     * @param {SelectOptions} options - The select options.
     */
    async selectByIndex(input: string | Locator, index: number, options?: SelectOptions): Promise<void> {
        const locator = await this.locatorUtils.getLocator(input);
        await locator.selectOption({ index: index }, options);
    }

    async selectByTextFromDynamicDropdown(
        inputLocator: Locator,
        optionLocator: Locator,
        text: string,
        waitInBetween: number = 0.5
    ): Promise<void> {
        await this.fill(inputLocator, text);
        await this.waitUntilLocatorVisible(optionLocator);
        await this.waitForTimeout(waitInBetween);
        await optionLocator.click({ force: true });
    }

    /**
     * 3. Alerts: This section contains s for handling alert dialogs.
     * These s include accepting and dismissing alerts, and getting the text of an alert.
     * Note: These s currently have some repetition and could be optimized by applying the DRY (Don't Repeat Yourself) principle.
     */

    /**
     * Accepts an alert dialog.
     * @param {string | Locator} input - The element to click to trigger the alert.
     * @param {string} promptText - The text to enter into a prompt dialog.
     * @returns {Promise<string>} - The message of the dialog.
     */
    async acceptAlert(input: string | Locator, promptText?: string): Promise<string> {
        const locator = await this.locatorUtils.getLocator(input);
        let dialogMessage = '';
        this.page.once('dialog', dialog => {
            dialogMessage = dialog.message();
            dialog.accept(promptText).catch(e => console.error('Error accepting dialog:', e));
        });
        await locator.click();
        // temporary fix to alerts - Need to be fixed
        // await this.page.waitForEvent('dialog');
        return dialogMessage;
    }

    /**
     * Dismisses an alert dialog.
     * @param {string | Locator} input - The element to click to trigger the alert.
     * @returns {Promise<string>} - The message of the dialog.
     */
    async dismissAlert(input: string | Locator): Promise<string> {
        const locator = await this.locatorUtils.getLocator(input);
        let dialogMessage = '';
        this.page.once('dialog', dialog => {
            dialogMessage = dialog.message();
            dialog.dismiss().catch(e => console.error('Error dismissing dialog:', e));
        });
        await locator.click({ noWaitAfter: true });
        // temporary fix for alerts - Need to be fixed
        // await this.page.waitForEvent('dialog');
        return dialogMessage;
    }

    /**
     * Gets the text of an alert dialog.
     * @param {string | Locator} input - The element to click to trigger the alert.
     * @returns {Promise<string>} - The message of the dialog.
     */
    async getAlertText(input: string | Locator): Promise<string> {
        const locator = await this.locatorUtils.getLocator(input);
        let dialogMessage = '';
        const dialogHandler = (dialog: Dialog) => {
            dialogMessage = dialog.message();

        };
        this.page.once('dialog', dialogHandler);
        await locator.click();
        await this.page.waitForEvent('dialog');
        this.page.off('dialog', dialogHandler);
        return dialogMessage;
    }

    /**
     * Gets the text of an alert dialog.
     * @param {string | Locator} input - The element to click to trigger the alert.
     * @returns {Promise<string>} - The message of the dialog.
     */
    async getAlertTextAndAccept(input: string | Locator): Promise<string> {
        const locator = await this.locatorUtils.getLocator(input);
        let alertText = '';

        // Listen for the dialog event
        this.page.once('dialog', async (dialog) => {
            alertText = dialog.message(); // Get the alert text
            await dialog.accept(); // Accept the alert
        });
        await locator.click();
        return alertText;
    }

    async getAlertTextAndClose() {
        let alertText = '';
        // Listen for the dialog event
        this.page.once('dialog', async (dialog) => {
            alertText = dialog.message(); // Get the alert text
            await dialog.accept(); // Accept the alert
        });
    }

    /**
     * Hovers over a specified element.
     * @param {string | Locator} input - The element to hover over.
     * @param {HoverOptions} options - The hover options.
     */
    async hover(input: string | Locator, options?: HoverOptions): Promise<void> {
        const locator = await this.locatorUtils.getLocator(input);
        await locator.hover(options);
    }

    /**
     * Focuses on a specified element.
     * @param {string | Locator} input - The element to focus on.
     * @param {TimeoutOption} options - The timeout options.
     */
    async focus(input: string | Locator, options?: TimeoutOption): Promise<void> {
        const locator = await this.locatorUtils.getLocator(input);
        await locator.focus(options);
    }

    /**
     * Drags and drops a specified element to a destination.
     * @param {string | Locator} input - The element to drag.
     * @param {string | Locator} dest - The destination to drop the element at.
     * @param {DragOptions} options - The drag options.
     */
    async dragAndDrop(
        input: string | Locator,
        dest: string | Locator,
        options?: DragOptions,
    ): Promise<void> {
        const drag = await this.locatorUtils.getLocator(input);
        const drop = await this.locatorUtils.getLocator(dest);
        await drag.dragTo(drop);
    }

    async customDragAndDrop(
        source: string | Locator,
        target: string | Locator
    ) {
        const sourceLocator = await this.locatorUtils.getLocator(source);
        const targetLocator = await this.locatorUtils.getLocator(target);

        const sourceBox = await sourceLocator.boundingBox();
        const targetBox = await targetLocator.boundingBox();

        if (sourceBox && targetBox) {
            await this.page.mouse.move(
                sourceBox.x + sourceBox.width / 2,
                sourceBox.y + sourceBox.height / 2
            );
            await this.page.mouse.down();
            await this.waitForTimeout(0.5);
            await this.page.mouse.move(
                targetBox.x + targetBox.width / 2,
                targetBox.y + targetBox.height / 2
            );
            await this.page.mouse.up();
            await this.waitForTimeout(0.5);
        } else {
            throw new Error("Bounding box not found for source or target.");
        }
    }

    /**
     * Double clicks on a specified element.
     * @param {string | Locator} input - The element to double click on.
     * @param {DoubleClickOptions} options - The double click options.
     */
    async doubleClick(input: string | Locator, options?: DoubleClickOptions): Promise<void> {
        const locator = await this.locatorUtils.getLocator(input);
        await locator.dblclick(options);
    }

    /**
     * Downloads a file from a specified element with retry mechanism.
     * @param {string | Locator} input - The element to download the file from.
     * @param {string} path - The path to save the downloaded file to.
     * @param {number} timeout - The timeout for the download operation (default: MAX_TIMEOUT).
     * @param {number} maxRetries - Maximum number of retry attempts (default: 3).
     */
    async downloadFile(input: string | Locator, path: string, timeout: number = MAX_TIMEOUT, maxRetries: number = 5): Promise<string> {
        const locator = await this.locatorUtils.getLocator(input);

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const downloadPromise = this.page.waitForEvent('download', { timeout });
                await this.click(locator);

                const download = await downloadPromise;
                // Save downloaded file somewhere
                FileUtils.createDir(path);
                const fileName = download.suggestedFilename();
                await download.saveAs(path + fileName);
                console.log(`Download successful on attempt ${attempt}: ${fileName}`);
                return fileName;
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.error(`Download attempt ${attempt} failed: ${errorMessage}`);

                if (attempt === maxRetries) {
                    // Last attempt failed, throw detailed error
                    if (errorMessage.includes('canceled')) {
                        throw new Error(`Download was canceled after ${maxRetries} attempts. This might be due to browser security settings, popup blockers, or network issues. Error: ${errorMessage}`);
                    } else if (errorMessage.includes('timeout')) {
                        throw new Error(`Download timed out after ${maxRetries} attempts (${timeout}ms each). The file might be too large or the server is slow to respond.`);
                    } else {
                        throw new Error(`Download failed after ${maxRetries} attempts with error: ${errorMessage}`);
                    }
                } else {
                    // Wait a bit before retrying
                    console.log(`Retrying download in 5 seconds... (attempt ${attempt + 1}/${maxRetries})`);
                    await this.page.waitForTimeout(5000);
                }
            }
        }

        // This should never be reached, but added for TypeScript completeness
        throw new Error('Download failed unexpectedly');
    }

    async downloadFileWithCustomName(input: string | Locator, path: string, fileName: string, timeout: number = MAX_TIMEOUT, maxRetries: number = 5) {
        const locator = await this.locatorUtils.getLocator(input);

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const downloadPromise = this.page.waitForEvent('download', { timeout });
                await this.click(locator);

                const download = await downloadPromise;
                // Save downloaded file somewhere
                FileUtils.createDir(path);
                await download.saveAs(path + fileName);
                console.log(`Download successful on attempt ${attempt}: ${fileName}`);
                return fileName;
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.error(`Download attempt ${attempt} failed: ${errorMessage}`);

                if (attempt === maxRetries) {
                    // Last attempt failed, throw detailed error
                    if (errorMessage.includes('canceled')) {
                        throw new Error(`Download was canceled after ${maxRetries} attempts. This might be due to browser security settings, popup blockers, or network issues. Error: ${errorMessage}`);
                    } else if (errorMessage.includes('timeout')) {
                        throw new Error(`Download timed out after ${maxRetries} attempts (${timeout}ms each). The file might be too large or the server is slow to respond.`);
                    } else {
                        throw new Error(`Download failed after ${maxRetries} attempts with error: ${errorMessage}`);
                    }
                } else {
                    // Wait a bit before retrying
                    console.log(`Retrying download in 5 seconds... (attempt ${attempt + 1}/${maxRetries})`);
                    await this.page.waitForTimeout(5000);
                }
            }
        }

        // This should never be reached, but added for TypeScript completeness
        throw new Error('Download failed unexpectedly');
    }

    /**
     * Uploads files to a specified element.
     * @param {string | Locator} input - The element to upload files to.
     * @param {UploadValues} path - The files to upload.
     * @param {UploadOptions} options - The upload options.
     */
    async uploadFiles(input: string | Locator, path: UploadValues, options?: UploadOptions): Promise<void> {
        const locator = await this.locatorUtils.getLocator(input);
        await locator.setInputFiles(path, options);
    }

    async uploadFile(triggerSelector: string, filePath: string | string[]): Promise<void> {
        const [fileChooser] = await Promise.all([
            this.page.waitForEvent('filechooser'),
            this.page.click(triggerSelector),
        ]);
        await fileChooser.setFiles(filePath);
    }

    /**
     * Scrolls a specified element into view.
     * @param {string | Locator} input - The element to scroll into view.
     * @param {TimeoutOption} options - The timeout options.
     */
    async scrollLocatorIntoView(input: string | Locator, options?: TimeoutOption): Promise<void> {
        const locator = await this.locatorUtils.getLocator(input);
        await this.waitUntilLocatorVisible(locator);
        await locator.scrollIntoViewIfNeeded(options);
    }

    /**
     * 4. JS: This section contains s that use JavaScript to interact with elements on a web page.
     * These s include clicking on an element using JavaScript.
     */

    /**
     * Clicks on a specified element using JavaScript.
     * @param {string | Locator} input - The element to click on.
     * @param {TimeoutOption} options - The timeout options.
     */
    async clickByJS(input: string | Locator, options?: TimeoutOption): Promise<void> {
        const locator = await this.locatorUtils.getLocator(input);
        await locator.evaluate('el => el.click()', options);
    }

    async closeBrowser() {
        await this.page.close();
    }

    /**
     * Waits for the network to be idle for a specified duration.
     * 
     * @param page - The Playwright Page object.
     * @param timeout - The maximum time to wait in milliseconds (default is 30,000 ms).
     */
    async waitForNetIdleState(): Promise<void> {
        await this.page.waitForLoadState('networkidle', { timeout: WAIT_FOR_NET_IDLE_TIMEOUT });
    }

    async getText(input: string | Locator, waitForLocator: boolean = true) {
        const locator = await this.locatorUtils.getLocator(input);
        if (waitForLocator) {
            await this.waitUntilLocatorVisible(locator);
        }
        const text = await locator.textContent();
        return text == null ? "" : text;
    }

    async getTextFromInput(input: string | Locator) {
        const locator = await this.locatorUtils.getLocator(input);
        await this.waitUntilLocatorVisible(locator);
        const text = await locator.inputValue();
        return text == null ? "" : text;
    }

    async getAttribute(input: string | Locator, attribute: string) {
        const locator = await this.locatorUtils.getLocator(input);
        await this.waitUntilLocatorVisible(locator);
        const text = await locator.getAttribute(attribute);
        return text == null ? "" : text;
    }

    async getAttributeForAllLocators(input: string | Locator, attribute: string) {
        const locator = await this.locatorUtils.getLocator(input);
        const list: string[] = [];
        for (const element of await locator.all()) {
            const text = await element.getAttribute(attribute);
            if (text != null) {
                list.push(text);
            }
        }
        return list;
    }

    async getTextIgnoreError(page: Page, input: string, waitTimeoutInMs = BIG_TIMEOUT) {
        const locator = page.locator(input);
        try {
            await locator.waitFor({ state: 'visible', timeout: waitTimeoutInMs });
            const text = await locator.textContent()
            return text == null ? "" : text;
        } catch (error) {
            return "";
        }
    }

    /**
     * Gets the value of a specified attribute from an element, ignoring errors if the element is not found or not visible.
     * @param {Page} page - The Playwright Page object.
     * @param {string} input - The selector for the element to get the attribute from.
     * @param {string} attribute - The name of the attribute to get.
     * @param {number} waitTimeoutInMs - The timeout in milliseconds to wait for the element to be visible (default: BIG_TIMEOUT).
     * @returns {Promise<string>} - The value of the specified attribute or an empty string if not found.
     */

    async getAttributeIgnoreError(page: Page, input: string, attribute: string, waitTimeoutInMs = BIG_TIMEOUT) {
        const locator = page.locator(input);
        try {
            await locator.waitFor({ state: 'visible', timeout: waitTimeoutInMs });
            const text = await locator.getAttribute(attribute);
            return text == null ? "" : text;
        } catch (error) {
            return "";
        }
    }

    /**
     * Gets all text contents from a specified locator.
     * @param {Locator} locators - The Playwright Locator object for the element to get text from.
     * @returns {Promise<string[]>} - An array of text contents from the locator.
     */

    async getTextFromLocators(locators: Locator): Promise<string[]> {
        const texts = await locators.allTextContents();
        return texts;
    }

    /**
     * Gets all locators matching the input string.
     * @param {string} input - The selector to find locators.
     * @returns {Promise<Locator[]>} - An array of Playwright Locator objects.
     */

    async getAllLocators(input: string) {
        return await this.locatorUtils.getAllLocator(input)
    }

    /**
     * Waits for a specified amount of time.
     * @param {number} input - The amount of time to wait in seconds.
     * @returns {Promise<void>} - A promise that resolves after the specified time.
     */

    async waitForTimeout(input: number) {
        return await this.page.waitForTimeout((input * 1000));
    }

    /**
     * Waits until a locator is visible on the page.
     * @param {Locator} locator - The Playwright Locator object for the element to wait for.
     * @param {number} timeoutInMs - The timeout in milliseconds to wait for the element to be visible (default: MAX_TIMEOUT).
     * @param {boolean} ignoreException - Whether to ignore exceptions if the element is not found (default: false).
     */

    async waitUntilLocatorVisible(locator: Locator, timeoutInMs = MAX_TIMEOUT, ignoreException: boolean = false) {
        try {
            await locator.waitFor({ state: 'visible', timeout: timeoutInMs });
        } catch (e) {
            if (!ignoreException) {
                throw e;
            }
        }
    }

    /**
     * Waits until a locator is invisible on the page.
     * @param {Locator} locator - The Playwright Locator object for the element to wait for.
     * @param {number} timeoutInMs - The timeout in milliseconds to wait for the element to be invisible (default: MAX_TIMEOUT).
     * @param {boolean} ignoreException - If true, ignores exceptions and does not throw an error if the locator does not become invisible (default: false).
     */

    async waitUntilLocatorInvisible(locator: Locator, timeoutInMs = MAX_TIMEOUT, ignoreException: boolean = false) {
        try {
            await locator.waitFor({ state: 'hidden', timeout: timeoutInMs });
        } catch (e) {
            if (!ignoreException) {
                throw e;
            }
        }
    }

    /**
     * Checks if an element is visible on the page.
     * @param {Locator} locator - The Playwright Locator object for the element to check.
     * @param {number} timeoutInMs - The timeout in milliseconds to wait for the element to be visible (default: BIG_TIMEOUT).
     * @returns {Promise<boolean>} - True if the element is visible, false otherwise.
     */

    async isElementVisible(locator: Locator, timeoutInMs = BIG_TIMEOUT): Promise<boolean> {
        try {
            await locator.waitFor({ state: 'visible', timeout: timeoutInMs });
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Checks if an element is invisible on the page.
     * @param {Locator} locator - The Playwright Locator object for the element to check.
     * @param {number} timeoutInMs - The timeout in milliseconds to wait for the element to be invisible (default: BIG_TIMEOUT).
     * @returns {Promise<boolean>} - True if the element is invisible, false otherwise.
     */

    async isElementInvisible(locator: Locator, timeoutInMs = BIG_TIMEOUT): Promise<boolean> {
        try {
            await locator.waitFor({ state: 'hidden', timeout: timeoutInMs });
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Checks if an element is visible on the page.
     * @param {Page} page - The Playwright Page object.
     * @param {string} selector - The selector for the element to check.
     * @param {number} timeoutInMs - The timeout in milliseconds to wait for the element to be visible (default: BIG_TIMEOUT).
     * @returns {Promise<boolean>} - True if the element is visible, false otherwise.
     */

    async isElementVisibleWithPage(page: Page, selector: string, timeoutInMs = BIG_TIMEOUT): Promise<boolean> {
        try {
            const locator = page.locator(selector);
            await locator.waitFor({ state: 'visible', timeout: timeoutInMs });
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Gets the text of the selected option in a dropdown.
     * @param {string | Locator} input - The dropdown to get the selected option from.
     * @returns {Promise<string>} - The text of the selected option.
     */

    async getSelectedDropdownText(input: string | Locator) {
        const locator = await this.locatorUtils.getLocator(input)
        await this.waitUntilLocatorVisible(locator);
        const selectedOption = locator.locator('option:checked');
        if (await selectedOption.count() === 0) {
            return "";
        }
        return await selectedOption.innerText();
    }

    /**
     * Gets all options from a dropdown.
     * @param {string | Locator} input - The dropdown to get options from.
     * @returns {Promise<string[]>} - An array of option texts.
     */

    async getAllDropdownOptions(input: string | Locator) {
        const locator = await this.locatorUtils.getLocator(input);
        const options = await locator.locator('option').allTextContents();
        return options;
    }

    /**
     * Waits for any text to be present in an input field.
     * This method is useful for ensuring that the input field has been filled with some text.
     * @param {Locator} inputLocator - The locator of the input field to check.
     */

    async waitForAnyTextInInputField(inputLocator: Locator): Promise<void> {
        await this.page.waitForFunction(
            (element) => {
                const input = element as HTMLInputElement;
                return input && input.value.trim() !== '';
            },
            await inputLocator.elementHandle()
        );
    }

    /**
     * Checks if a checkbox or radio button is checked.
     * @param {string | Locator} input - The checkbox or radio button to check.
     * @returns {Promise<boolean>} - True if the checkbox is checked, false otherwise.
     */

    async isCheckboxChecked(input: string | Locator) {
        const locator = await this.locatorUtils.getLocator(input);
        return locator.isChecked();
    }

    /**
     * Gets all text contents from a specified locator, ignoring errors if the locator is not found or not visible.
     * @param {Page} page - The Playwright Page object.
     * @param {string} input - The selector for the element to get text from.
     * @param {number} waitTimeoutInMs - The timeout in milliseconds to wait for the element to be visible (default: BIG_TIMEOUT).
     * @returns {Promise<string[]>} - An array of text contents from the locator.
     */

    async getAllTextIgnoreError(page: Page, input: string, waitTimeoutInMs = BIG_TIMEOUT) {
        const locator = page.locator(input);
        try {
            await locator.first().waitFor({ state: 'visible', timeout: waitTimeoutInMs });
            return await locator.allTextContents();
        } catch (error) {
            return [];
        }
    }

    /**
     * Presses a key on the keyboard while focusing on a specified element.
     * @param {string | Locator} input - The element to focus on before pressing the key.
     * @param {string} key - The key to press (e.g., 'Enter', 'Escape', 'ArrowDown').
     */

    async pressKey(input: string | Locator, key: string) {
        const locator = await this.locatorUtils.getLocator(input);
        await locator.focus();
        await this.waitForTimeout(0.5);
        await this.page.keyboard.press(key);
    }

    async switchToTab() {
        await test.step(`Switch to '${await this.page.title()}'`, async () => {
            await this.page.bringToFront();
        });
    }

    async closePage() {
        await test.step(`Close page '${await this.page.title()}'`, async () => {
            await this.page.close();
        });
    }

    /**
     * Waits for the page to fully load and settle, including network idle and UI stability.
     * This method combines waiting for the DOM to load, network requests to finish, and UI content to stabilize.
     * @param {number} timeout - The maximum time to wait for the page to fully load (default: MAX_TIMEOUT).
     * @throws {Error} If the page does not fully load within the specified timeout.
     */
    async waitForPageToFullyLoad(timeout: number = MAX_TIMEOUT) {
        const startTime = Date.now();
        const timeoutAt = startTime + timeout;

        try {
            // Step 1: Wait for basic page load states
            await this.page.waitForLoadState('domcontentloaded', { timeout: timeout });

            // Step 2: Wait for all resources to load
            await this.page.waitForLoadState('load', { timeout: timeout });

            // Step 3: Wait for network idle to catch any immediate API calls
            await this.page.waitForLoadState('networkidle', { timeout: timeout });

            // Step 4: Enhanced network activity monitoring for API calls
            await this.waitForNetworkActivityComplete(timeoutAt);

            // Step 5: Wait for any pending JavaScript execution
            await this.waitForJavaScriptExecution(timeoutAt);

            // Step 6: Wait for UI stability and loaders to disappear
            await this.waitForUIStability(timeoutAt);

            // Step 7: Final network idle check
            await this.waitForFinalNetworkIdle(timeoutAt);

            // Step 8: Final Check If Page Loader is still visible
            await this.waitForActionToComplete(timeout);

        } catch (error) {
            const elapsed = Date.now() - startTime;
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.warn(`waitForPageToFullyLoad completed with warning after ${elapsed}ms: ${errorMessage}`);
            // Don't throw error, just log warning and continue
        }
    }

    /**
     * Enhanced network activity monitoring that detects API calls and AJAX requests
     */
    private async waitForNetworkActivityComplete(timeoutAt: number) {
        let lastActivityTime = Date.now();
        let consecutiveIdleChecks = 0;
        const idleThreshold = 500; // 500 ms of no activity to consider idle
        const maxIdleChecks = 5;

        while (Date.now() < timeoutAt && consecutiveIdleChecks < maxIdleChecks) {
            try {
                // Monitor multiple types of network activity
                const networkActivity = await this.page.evaluate(() => {
                    const now = Date.now();

                    // Check for active XMLHttpRequests and fetch requests
                    const activeRequests = (window as any).__activeRequests || 0;

                    // Check for recent network activity using Performance API
                    const recentRequests = performance.getEntriesByType('resource')
                        .filter(entry => {
                            const resourceEntry = entry as PerformanceResourceTiming;
                            const isRecent = resourceEntry.startTime > now - 2000; // Within last 2 seconds
                            const isApiCall = resourceEntry.initiatorType === 'xmlhttprequest' ||
                                resourceEntry.initiatorType === 'fetch' ||
                                resourceEntry.name.includes('/api/') ||
                                resourceEntry.name.includes('.json') ||
                                resourceEntry.name.includes('ajax');
                            return isRecent && isApiCall && !resourceEntry.responseEnd;
                        }).length;

                    // Check for pending promises (if tracking is available)
                    const pendingPromises = (window as any).__pendingPromises || 0;

                    return {
                        activeRequests,
                        recentRequests,
                        pendingPromises,
                        totalActivity: activeRequests + recentRequests + pendingPromises
                    };
                });

                if (networkActivity.totalActivity === 0) {
                    consecutiveIdleChecks++;
                    if (Date.now() - lastActivityTime > idleThreshold) {
                        break; // Network is truly idle
                    }
                } else {
                    consecutiveIdleChecks = 0;
                    lastActivityTime = Date.now();
                }

                await this.page.waitForTimeout(50);
            } catch (error) {
                // If evaluation fails, continue with reduced checks
                consecutiveIdleChecks++;
                await this.page.waitForTimeout(50);
            }
        }
    }

    /**
     * Waits for JavaScript execution to complete and DOM to stabilize
     */
    private async waitForJavaScriptExecution(timeoutAt: number) {
        let stableCount = 0;
        const maxChecks = 8;

        for (let i = 0; i < maxChecks && Date.now() < timeoutAt; i++) {
            try {
                const jsActivity = await this.page.evaluate(() => {
                    // Check for ongoing JavaScript activity
                    const activeTimeouts = (window as any).__activeTimeouts || 0;
                    const activeIntervals = (window as any).__activeIntervals || 0;
                    const animationFrames = (window as any).__activeAnimationFrames || 0;

                    // Check if document is ready and scripts are loaded
                    const scriptsLoaded = document.readyState === 'complete';
                    const scripts = Array.from(document.querySelectorAll('script[src]:not([async]):not([defer])'));
                    const noActiveScripts = scripts.length === 0 || scripts.every(script => {
                        // Check if script has loaded (no error and appears to be loaded)
                        return !(script as any).loading && document.readyState === 'complete';
                    });

                    return {
                        activeTimeouts,
                        activeIntervals,
                        animationFrames,
                        scriptsLoaded,
                        noActiveScripts,
                        totalActivity: activeTimeouts + activeIntervals + animationFrames
                    };
                });

                if (jsActivity.scriptsLoaded && jsActivity.totalActivity === 0) {
                    stableCount++;
                    if (stableCount >= 3) break;
                } else {
                    stableCount = 0;
                }

                await this.page.waitForTimeout(50);
            } catch (error) {
                // If evaluation fails, just wait and continue
                await this.page.waitForTimeout(50);
                break;
            }
        }
    }

    /**
     * Waits for UI stability by monitoring loaders, spinners, and content changes
     */
    private async waitForUIStability(timeoutAt: number) {
        let stableCount = 0;
        let previousContentHash = '';
        const maxChecks = 10;

        for (let i = 0; i < maxChecks && Date.now() < timeoutAt; i++) {
            try {
                const uiState = await this.page.evaluate(() => {
                    // Check for common loading indicators
                    const loadingSelectors = [
                        '[class*="loading"]', '[class*="spinner"]', '[class*="loader"]',
                        '[id*="loading"]', '[id*="spinner"]', '[id*="loader"]',
                        '.fa-spin', '.fa-spinner', '.fa-circle-o-notch',
                        '[aria-label*="loading"]', '[aria-label*="Loading"]'
                    ];

                    const visibleLoaders = loadingSelectors.some(selector => {
                        const elements = document.querySelectorAll(selector);
                        return Array.from(elements).some(el => {
                            const style = window.getComputedStyle(el);
                            return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
                        });
                    });

                    // Check for disabled states that might indicate processing
                    const disabledElements = document.querySelectorAll('button[disabled], input[disabled]').length;

                    // Create a content hash of main visible content
                    const mainContent = document.querySelector('main, #main, .main, body')?.textContent?.trim() || '';
                    const contentHash = mainContent.substring(0, 500); // First 500 chars for comparison

                    // Check for tables or lists that might be loading data
                    const emptyTables = Array.from(document.querySelectorAll('table tbody')).some(tbody =>
                        tbody.children.length === 0 && tbody.parentElement?.querySelector('thead')
                    );

                    return {
                        visibleLoaders,
                        disabledElements,
                        contentHash,
                        emptyTables,
                        isStable: !visibleLoaders && !emptyTables
                    };
                });

                // Check content stability
                if (uiState.contentHash === previousContentHash && uiState.isStable) {
                    stableCount++;
                    if (stableCount >= 4) break;
                } else {
                    stableCount = 0;
                    previousContentHash = uiState.contentHash;
                }

                await this.page.waitForTimeout(50);
            } catch (error) {
                // If evaluation fails, just wait and continue
                await this.page.waitForTimeout(50);
                break;
            }
        }
    }

    /**
     * Final network idle check to ensure no last-minute requests
     */
    private async waitForFinalNetworkIdle(timeoutAt: number) {
        try {
            const remainingTime = Math.max(1000, timeoutAt - Date.now());
            await this.page.waitForLoadState('networkidle', {
                timeout: Math.min(remainingTime, 30000) // Cap at 30 seconds
            });
        } catch (error) {
            // Final check failed, but don't throw error
            // console.warn('Final network idle check timed out, continuing...');
        }
    }

    /**
     * Enhanced version of waitForLoad that can be used after any action that might trigger API calls
     * This method is specifically designed to handle modern web applications with dynamic content
     * @param {number} timeout - Maximum time to wait (default: MAX_TIMEOUT)
     */
    async waitForCompletePageLoad(timeout: number = MAX_TIMEOUT): Promise<void> {
        await this.waitForPageToFullyLoad(timeout);
    }

    /**
     * Waits for specific loading indicators to disappear
     * @param {string[]} customSelectors - Additional selectors to wait for to disappear
     * @param {number} timeout - Maximum time to wait
     */
    async waitForLoadersToDisappear(customSelectors: string[] = [], timeout: number = MAX_TIMEOUT): Promise<void> {
        const commonLoaderSelectors = [
            '[class*="loading"]', '[class*="spinner"]', '[class*="loader"]',
            '[id*="loading"]', '[id*="spinner"]', '[id*="loader"]',
            '.fa-spin', '.fa-spinner', '.fa-circle-o-notch',
            '[aria-label*="loading"]', '[aria-label*="Loading"]',
            '.loading-overlay', '.spinner-border', '.spinner-grow',
            ...customSelectors
        ];

        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            try {
                const visibleLoaders = await this.page.evaluate((selectors) => {
                    return selectors.some(selector => {
                        const elements = document.querySelectorAll(selector);
                        return Array.from(elements).some(el => {
                            const style = window.getComputedStyle(el);
                            const htmlEl = el as HTMLElement;
                            return style.display !== 'none' &&
                                style.visibility !== 'hidden' &&
                                style.opacity !== '0' &&
                                htmlEl.offsetParent !== null;
                        });
                    });
                }, commonLoaderSelectors);

                if (!visibleLoaders) {
                    break; // No visible loaders found
                }

                await this.page.waitForTimeout(200);
            } catch (error) {
                break; // If evaluation fails, assume loaders are gone
            }
        }
    }

    /**
     * Waits for specific API endpoints to complete their requests
     * @param {string[]} apiEndpoints - Array of API endpoint patterns to wait for
     * @param {number} timeout - Maximum time to wait
     */
    async waitForApiEndpoints(apiEndpoints: string[], timeout: number = MAX_TIMEOUT): Promise<void> {
        const startTime = Date.now();
        const pendingEndpoints = new Set(apiEndpoints);

        // Listen for response events
        const responseHandler = (response: any) => {
            const url = response.url();
            apiEndpoints.forEach(endpoint => {
                if (url.includes(endpoint)) {
                    pendingEndpoints.delete(endpoint);
                }
            });
        };

        this.page.on('response', responseHandler);

        try {
            while (pendingEndpoints.size > 0 && Date.now() - startTime < timeout) {
                await this.page.waitForTimeout(100);
            }
        } finally {
            this.page.off('response', responseHandler);
        }

        if (pendingEndpoints.size > 0) {
            console.warn(`Some API endpoints did not complete: ${Array.from(pendingEndpoints).join(', ')}`);
        }
    }

    /**
     * Waits for a specific network response matching a URL pattern
     * @param {string | RegExp} urlPattern - URL pattern to match
     * @param {number} timeout - Maximum time to wait
     */
    async waitForNetworkResponse(urlPattern: string | RegExp, timeout: number = MAX_TIMEOUT): Promise<void> {
        try {
            await this.page.waitForResponse(urlPattern, { timeout });
        } catch (error) {
            console.warn(`Timeout waiting for network response matching: ${urlPattern}`);
        }
    }

    /**
     * Simple, fast utility to wait for XHR/API calls to complete and loaders to disappear.
     * Perfect for use after any action that triggers data loading, CRUD operations, or navigation.
     * @param {number} timeout - Maximum time to wait (default: 15000ms)
     * @param {string[]} customLoaderSelectors - Additional loader selectors specific to your app
     */
    async waitForActionToComplete(timeout: number = MAX_TIMEOUT, customLoaderSelectors: string[] = []): Promise<void> {
        const startTime = Date.now();
        let lastNetworkActivity = Date.now();
        const networkIdleThreshold = 300; // 300ms of no network activity = idle

        // Common loader selectors used in your project
        const loaderSelectors = [
            '[class*="loading"]', '[class*="spinner"]', '[class*="loader"]',
            '[id*="loading"]', '[id*="spinner"]', '[id*="loader"]',
            '.fa-spin', '.fa-spinner', '.fa-circle-o-notch',
            '[aria-label*="loading"]', '[aria-label*="Loading"]',
            '.loading-overlay', '.spinner-border', '.spinner-grow',
            '#loading',
            ...customLoaderSelectors
        ];

        while (Date.now() - startTime < timeout) {
            try {
                // Check network activity and loaders in one evaluation for efficiency
                const state = await this.page.evaluate((selectors) => {
                    const now = Date.now();

                    // Check for active network requests (if your app tracks them)
                    const activeRequests = (window as any).__activeRequests || 0;

                    // Check for recent XHR/fetch activity using Performance API
                    const recentNetworkActivity = performance.getEntriesByType('resource')
                        .some(entry => {
                            const resourceEntry = entry as PerformanceResourceTiming;
                            return resourceEntry.startTime > now - 1000 && // Within last 1 second
                                (resourceEntry.initiatorType === 'xmlhttprequest' ||
                                    resourceEntry.initiatorType === 'fetch') &&
                                !resourceEntry.responseEnd;
                        });

                    // Check for visible loaders (most important for your use case)
                    const hasVisibleLoaders = selectors.some(selector => {
                        try {
                            const elements = document.querySelectorAll(selector);
                            return Array.from(elements).some(el => {
                                const style = window.getComputedStyle(el);
                                const htmlEl = el as HTMLElement;
                                return style.display !== 'none' &&
                                    style.visibility !== 'hidden' &&
                                    parseFloat(style.opacity) > 0 &&
                                    htmlEl.offsetParent !== null;
                            });
                        } catch {
                            return false;
                        }
                    });

                    const networkActive = activeRequests > 0 || recentNetworkActivity;

                    return {
                        networkActive,
                        hasVisibleLoaders,
                        isComplete: !networkActive && !hasVisibleLoaders
                    };
                }, loaderSelectors) as { networkActive: boolean; hasVisibleLoaders: boolean; isComplete: boolean };

                // Update last network activity time
                if (state.networkActive) {
                    lastNetworkActivity = Date.now();
                }

                // If everything is complete, we're done
                if (state.isComplete && (Date.now() - lastNetworkActivity > networkIdleThreshold)) {
                    return;
                }

                // Short wait before next check (balance between responsiveness and CPU usage)
                await this.page.waitForTimeout(100);

            } catch (error) {
                // If evaluation fails, do a basic network idle check and continue
                try {
                    await this.page.waitForLoadState('networkidle', { timeout: timeout });
                    return;
                } catch {
                    // Even network idle failed, just continue - page might be ready
                    return;
                }
            }
        }

        // If we hit timeout, log warning but don't throw error
        console.warn(`waitForActionToComplete timed out after ${timeout}ms, continuing...`);
    }

    /**
     * Ultra-simple, lightning-fast wait for XHR/API calls and basic loaders.
     * Use this for the most common case where you just need to wait after an action.
     * @param {number} timeout - Maximum time to wait (default: 10000ms)
     */
    async waitForQuickAction(timeout: number = 10000): Promise<void> {
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            try {
                // Single evaluation check for maximum speed
                const isReady = await this.page.evaluate(() => {
                    // Check for common loading indicators
                    const hasLoader = document.querySelector('[class*="loading"], [class*="spinner"], .fa-spin, .loading-overlay') !== null;

                    // Check for active XHR/fetch (basic check)
                    const activeRequests = (window as any).__activeRequests || 0;

                    return !hasLoader && activeRequests === 0;
                });

                if (isReady) {
                    return;
                }

                // Quick 50ms wait for better performance
                await this.page.waitForTimeout(50);

            } catch {
                // On any error, fall back to basic network idle
                try {
                    await this.page.waitForLoadState('networkidle', { timeout: 2000 });
                    return;
                } catch {
                    return; // Continue if even this fails
                }
            }
        }
    }
}