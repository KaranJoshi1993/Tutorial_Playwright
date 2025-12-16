export const LoginPageConstant = {
  // url: "https://staging-admin-validation.ship-watch.com/customlogin",
  emailInput: "input[id='userName']",
  passwordInput: "input[id='password']",
  loginButton: "//span[text()='Sign In']",
  logoutButton: "svg[data-icon='logout']",
  emailError:"//div[text()='Username is required']",
  passwordError:"//div[text()='Password must be 8-20 characters long and not contain white spaces']",
  errorMessage:"//span[text()='Sign in with Microsoft']",
};

export const LoginPageAssertion = {
  alertReportsListURL: "/alert/reports",
  microsoft: "Sign in with Microsoft",
};