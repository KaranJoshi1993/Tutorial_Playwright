import { defineConfig, devices } from '@playwright/test';
import { WaitForLoadStateOptions } from '@utils/optional-parameter-types';

export const LOADSTATE: WaitForLoadStateOptions = 'domcontentloaded';
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  expect: {
    timeout: 30000,
  },
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results',
      suiteTitle: false,
      categories: [
        {
          name: 'Broken tests',
          matchedStatuses: ['broken']
        },
        {
          name: 'Failed tests',
          matchedStatuses: ['failed']
        }
      ],
      environmentInfo: {
        framework: 'Playwright',
        node_version: process.version,
        os: process.platform
      }
    }]
  ],
  use: {
    baseURL: "https://reactjs-shipwatch.agiletechnologies.in/",
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    viewport: { width: 1920, height: 1080 },
    actionTimeout: 30000,
    navigationTimeout: 30000,
    headless: false,
    launchOptions: {
      args: [
        '--window-size=1920,1080'
      ],
    },
  },

  projects: [
    {
      name: 'chromium',
      use: {
        viewport: null,
      },
    },
  ],
});
