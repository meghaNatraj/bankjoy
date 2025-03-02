import { defineConfig } from '@playwright/test';
require('custom-env').env(true)

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL, // Set API base URL
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
  },
});
