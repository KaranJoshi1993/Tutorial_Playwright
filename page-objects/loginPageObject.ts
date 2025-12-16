import test, { BrowserContext, expect, Page } from "@playwright/test";
import { LoginPageConstant, LoginPageAssertion } from '../page-constants/loginPageConstant';
import { ActionUtils } from "../utils/action-utils";

export class LoginPageObject extends ActionUtils {

  page: Page;
  context: BrowserContext;
  constructor(page: Page, context: BrowserContext) {
    super(page, context);
    this.page = page;
    this.context = context;
  }

  //Actions
  async navigateTo() {
    await this.page.goto('/customlogin'); // Use baseURL from config instead of hardcoded URL
  }

  async enterEmail(email: string) {
    await this.page.fill(LoginPageConstant.emailInput, email);
  }

  async enterPassword(password: string) {
    await this.page.fill(LoginPageConstant.passwordInput, password);
  }

  async clickLogin(page: Page) {
    await this.page.click(LoginPageConstant.loginButton);
  }

  //Assertions
  async verifyUserHasBeenSignedIn() {
    await test.step("Verify User has been Signed In Successfully", async () => {
      await expect(this.page, "User should be navigated to Alert Reports List page").toHaveURL(LoginPageAssertion.alertReportsListURL);
    });
  }

}
