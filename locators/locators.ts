export const LOGIN_PAGE_SELECTORS = {
  url: "https://react-broker-portal.agiletechnologies.in",
  emailInput: "input[id=email]",
  passwordInput: "input[id=password]",
  loginButton: "button[type='submit']",
  logoutButton: "//p[text()='Logout Account']",
  emailError:"//span[text()='Email is required.']",
  passwordError:"//span[text()='Password is required.']",
  errorMessage:"//span[text()='Email or Password is invalid.']",
};

export const HOME_PAGE_SELECTORS = {
  quotes: "li[link='/quotes']",
  policies: "li[link='/policies']"
};

export const NEW_QUOTE_SELECTORS = {
  newQuote: "//span[text()='New Quote']",
  riskLocation: "li[link='/new-quotes/search-risk-location']",
  coverage: "li[link='/new-quotes/coverage/form']",
  quote: "li[link='/new-quotes/quote/form']",
  bindPolicy: "/new-quotes/bind-policy",
  issuedPolicy: "li[link='/new-quotes/issued-policy']"
};
