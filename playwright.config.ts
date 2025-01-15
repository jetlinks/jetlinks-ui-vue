import { defineConfig} from '@playwright/test';

export default  defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:9000',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    browserName: 'chromium',
  },

})
