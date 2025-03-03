import { defineConfig } from '@playwright/test';
require('custom-env').env(true)

export default defineConfig({
    testDir: './tests', // Folder containing API tests
    workers: process.env.CI ? 2 : 4,
    use: {
        baseURL: process.env.BASE_URL, // Set API base URL
        extraHTTPHeaders: {
            'Content-Type': 'application/json',
        }
    },
    reporter: 'html',
    fullyParallel: true
});
