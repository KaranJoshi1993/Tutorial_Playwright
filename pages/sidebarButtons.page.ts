import { Page } from '@playwright/test';
import BasePage from './base.page';
import { HOME_PAGE_SELECTORS, NEW_QUOTE_SELECTORS } from '../locators/locators';

export default class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async verifyDashboardTitle(): Promise<boolean> {
    const title = await this.page.title();
    return title.includes('Dashboard');
  }

  async clickQuotes() {
    await this.click(HOME_PAGE_SELECTORS.quotes);
  }

  async clickPolicies() {
    await this.click(HOME_PAGE_SELECTORS.policies);
  }

  async clickNewQuote() {
    await this.click(NEW_QUOTE_SELECTORS.newQuote);
  }

  async clickRiskLocation() {
    await this.click(NEW_QUOTE_SELECTORS.riskLocation);
  }

  async clickCoverage() {
    await this.click(NEW_QUOTE_SELECTORS.coverage);
  }

  async clickQuote() {
    await this.click(NEW_QUOTE_SELECTORS.quote);
  }

  async clickBindPolicy() {
    await this.click(NEW_QUOTE_SELECTORS.bindPolicy);
  }

  async clickIssuedPolicy() {
    await this.click(NEW_QUOTE_SELECTORS.issuedPolicy);
  }
}
