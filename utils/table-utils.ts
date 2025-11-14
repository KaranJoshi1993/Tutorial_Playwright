import { Locator, Page } from "@playwright/test";
import { ActionUtils } from "./action-utils";
// import { CommonPageObject } from "../page-objects/CommonPageObject";


export class TableUtils extends ActionUtils {
    page: Page;
    // commonPageObject: CommonPageObject;
    tableLocator: Locator;

    constructor(page: Page, tableLocator: Locator) {
        super(page, page.context());
        this.page = page;
        this.tableLocator = tableLocator;
    }

    // Wait for table to load
    async waitForLoader() {
        await this.waitForLoadersToDisappear();
    }

    // Get table headers dynamically
    async getTableHeaders(): Promise<string[]> {
        await this.waitForLoader();

        const headers = await this.tableLocator.locator(`thead tr td,thead th`).elementHandles();
        return Promise.all(headers.map(async (header) => (await header.innerText()).trim()));
    }

    // Get table data dynamically with option to skip first or last row
    async getTableData(skipFirstRow = false, skipLastRow = false): Promise<Record<string, string>[]> {
        await this.waitForLoad();
        await this.waitForLoader();
        await this.waitUntilLocatorVisible(this.tableLocator.locator(`tbody tr`).first());
        if (await this.tableLocator.locator(`tbody tr td`).count() === 1) {
            // If there's only one cell, return an empty array
            return [];
        }
        const headers = await this.getTableHeaders();
        const rows = await this.tableLocator.locator(`tbody tr`).elementHandles();
        const tableData: Record<string, string>[] = [];

        const startIndex = skipFirstRow ? 1 : 0;
        const endIndex = skipLastRow ? rows.length - 1 : rows.length;

        for (let i = startIndex; i < endIndex; i++) {
            const row = rows[i];
            const cells = await row.$$("td");
            const rowData: Record<string, string> = {};

            for (let j = 0; j < headers.length; j++) {
                rowData[headers[j]] = (await cells[j]?.innerText())?.trim() || "";
            }

            tableData.push(rowData);
        }

        return tableData;
    }

    // Get first record from table
    async getFirstRow(): Promise<Record<string, string> | null> {
        await this.waitForLoader();

        const headers = await this.getTableHeaders();
        const rows = await this.tableLocator.locator(`tbody tr`).elementHandles();

        if (rows.length === 0) return null;

        const row = rows[0];
        const cells = await row.$$("td");
        const rowData: Record<string, string> = {};

        for (let j = 0; j < headers.length; j++) {
            rowData[headers[j]] = (await cells[j]?.innerText())?.trim() || "";
        }

        return rowData;
    }

    // Select a checkbox in a row based on column value with option to skip first or last row
    async selectCheckbox(columnValue: string, skipFirstRow = false, skipLastRow = false) {
        await this.waitForLoader();

        const rows = this.tableLocator.locator(`tbody tr`);
        const rowCount = await rows.count();

        for (let i = 0; i < rowCount; i++) {
            if ((skipFirstRow && i === 0) || (skipLastRow && i === rowCount - 1)) {
                continue;
            }

            const row = rows.nth(i);
            if (await row.locator(`td:has-text("${columnValue}")`).count() > 0) {
                await row.locator('input[type="checkbox"]').check({ force: true });
                break;
            }
        }
    }

    // Click an action button in a row based on column value with option to skip first or last row
    async clickAction(columnValue: string, action: "edit" | "delete", skipFirstRow = false, skipLastRow = false) {
        await this.waitForLoader();

        const rows = this.tableLocator.locator(`tbody tr`);
        const rowCount = await rows.count();

        for (let i = 0; i < rowCount; i++) {
            if ((skipFirstRow && i === 0) || (skipLastRow && i === rowCount - 1)) {
                continue;
            }

            const row = rows.nth(i);
            if (await row.locator(`td:has-text("${columnValue}")`).count() > 0) {
                if (action === "edit") {
                    await row.locator('a.btn-primary').click();
                } else if (action === "delete") {
                    await row.locator('a.btn-danger').click();
                }
                break;
            }
        }
    }

    // Sort by column dynamically (no changes needed for skipping rows)
    async sortByColumn(columnName: string, order: "asc" | "desc") {
        await this.waitForLoader();

        const column = this.tableLocator.locator(`thead th:has-text("${columnName}")`);
        const ariaSort = await column.getAttribute("aria-sort");

        // Click until the desired order is set
        if (order === "asc" && ariaSort !== "ascending") {
            await column.click();
            if (await column.getAttribute("aria-sort") !== "ascending") {
                await column.click(); // Click again if needed
            }
        } else if (order === "desc" && ariaSort !== "descending") {
            await column.click();
            if (await column.getAttribute("aria-sort") !== "descending") {
                await column.click(); // Click again if needed
            }
        }
    }
}