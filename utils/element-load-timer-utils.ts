import { Page } from "@playwright/test";

export interface ElementLoadEntry {
  step: string;
  selector: string;
  durationMs: number;
}

export class ElementLoadTimer {
  private page: Page;
  private entries: ElementLoadEntry[] = [];

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Measures how long an element takes to appear (visible state).
   * @param selector - Element selector.
   * @param stepName - Descriptive name for the step.
   */
  async timeToLoad(selector: string, stepName: string): Promise<void> {
    const start = performance.now();

    try {
      await this.page.waitForSelector(selector, {
        state: "visible",
        timeout: 10000,
      });
    } catch (error) {
      console.error(
        `[Timeout] "${stepName}" - selector "${selector}" not found.`
      );
      throw error;
    }

    const end = performance.now();
    const duration = end - start;

    this.entries.push({
      step: stepName,
      selector,
      durationMs: parseFloat(duration.toFixed(2)),
    });
  }

  getResults(): ElementLoadEntry[] {
    return this.entries;
  }
}
