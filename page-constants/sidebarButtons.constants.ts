export const SIDEBAR_BUTTONS_SELECTORS = {
  alerReportsButton: "//span[text()='Alert Reports']",
  vesselReportsButton: "//span[text()='Vessel Reports (Raw)']",
  validationButton: "li[link='/validation-rules']",
  validationRulesButton: "//span[text()='Validation Rules']",
  managePortsButton: "//span[text()='Manage Ports']",
  usersButton: "//span[text()='Users']",
  spireAISGapsButton: "//span[text()='Spire AIS Gaps']",
  formConfigurationButton: "//span[text()='Form Configuration']",
  informationManagementButton: "//span[text()='Information Management']"
};

export const SIDEBAR_BUTTONS_ASSERTIONS = {
  alertReportsListURL: "/alert/reports",
  vesselReportsListURL: "/vessel-reports",
  validationRulesURL: "/validation-rules/validation",
  managePortsURL: "/ports",
  usersURL: "/users",
  spireAISGapsURL: "/spire-ais-gaps",
  formConfigurationURL: "/form-configuration",
  informationManagementURL: "/information-management"
};