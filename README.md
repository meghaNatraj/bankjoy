# Bankjoy Technical Assignment

This Repository contains API tests for Bank of Canada Valet APIs

## Prerequisites

### 1. Install Node.js  
Ensure that **Node.js (LTS version 18 or later)** is installed on your machine. You can check your Node.js version with:  

```bash 
node -v
```
If not installed, download it from [Node.js Official Website](https://nodejs.org/en).

### 2. Install Playwright Test

```bash
npm install @playwright/test
```

### 3. Install Typescript

```bash
npm install typescript --save-dev
```

### 4. Install Playwright dependencies

```bash
npx playwright install
```

## Execution command

```bash
NODE_ENV=dev npx playwright test
```

#### Tags
Tags can be used in execution command to execute selected set of tests or single test. Tags will be added in the test description under spec files

```bash
NODE_ENV=dev npx playwright test --grep @series1
```

#### Test Report

Playwright provides different types are [reporters](https://playwright.dev/docs/test-reporters) which can added in playwright.config.ts. Currently HTML Report included in this Framework which can be accessed by below command after each execution.

```bash
npx playwright show-report
```

## Folder Structure 
- **src/**: Contains all API calls, HTTP methods and utilities files.
  - **apis/**: Holds API calls along with url and other data required
  - **core/**: Holds core HTTP method calls
  - **utils/**: Holds any utility scripts or helper functions used in tests.
- **test-data**/: Contains test data used in tests
- **tests/**: Test spec files, contains all Tests
- **.env.dev**/: Contains all data specific to the environment
- **.gitignore**: Specifies files and folders to ignore in version control (e.g., `node_modules`)
- **package.json**: Contains project metadata, dependencies, and scripts.
- **playwright.config.ts**/: Contains all global configurations

## Parallelism     

Tests will be executed in parallel by default and can be changed to "serial" mode for specific spec file, if needed.

## Environment Files
Currently .env.dev added to organize all environment specific data, more files can be added based on environments e.g, .env.stg and should be passed in execution command to choose different environment

```bash
NODE_ENV=stg npx playwright test
```






