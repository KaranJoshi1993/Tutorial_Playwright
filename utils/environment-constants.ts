// ENV VARIABLES
require('dotenv').config()
export const ENVCONSTANTS = class { 
    static readonly MAILTRAP_API_TOKEN = process.env.ENVIRONMENT === 'sandbox' || process.env.ENVIRONMENT === 'security' || process.env.ENVIRONMENT === 'preview' ? process.env.SANDBOX_MAILTRAP_API_TOKEN : process.env.INTEGRATION_MAILTRAP_API_TOKEN;
    static readonly INBOX_ID = process.env.ENVIRONMENT === 'sandbox' || process.env.ENVIRONMENT === 'security' || process.env.ENVIRONMENT === 'preview' ? process.env.SANDBOX_MAILTRAP_INBOX_ID : process.env.INTEGRATION_MAILTRAP_INBOX_ID;
    static readonly ACCOUNT_ID = process.env.ENVIRONMENT === 'sandbox' || process.env.ENVIRONMENT === 'security' || process.env.ENVIRONMENT === 'preview' ? process.env.SANDBOX_MAILTRAP_ACCOUNT_ID : process.env.INTEGRATION_MAILTRAP_ACCOUNT_ID;
    static readonly MAIL_TRAP_API_BASE_URL = "https://mailtrap.io/api";
    static readonly LOGIN_EMAIL = process.env.USER_EMAIL || 'franki@desktopsolutions.com';
    static readonly LOGIN_PASSWORD = process.env.USER_PASSWORD || 'Lexitas!0000';
    static readonly LOGIN_USERNAME = process.env.USER_NAME || 'System User';
    static readonly ENVIRONMENT = process.env.ENVIRONMENT || 'sandbox';
    static AUTH_TOKEN: string = '';
    static AUTH_TOKEN_TIMESTAMP: any = null;
}