import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL, // Set your API base URL
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
  },
});
