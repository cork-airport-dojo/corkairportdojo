# Cypress Test Framework

This directory contains the end-to-end (E2E) tests for the CorkAirportDojo web application using [Cypress](https://www.cypress.io/).

## Overview

Cypress is a JavaScript-based testing framework that runs in the browser to automate E2E testing. It provides:

- **Real browser execution** - Tests run in an actual browser (Chrome, Firefox, Edge)
- **Automatic waiting** - Cypress automatically waits for elements to be visible before interacting
- **Time-travel debugging** - Inspect the state of your app at any point in test execution
- **Live reload** - Tests reload when you save test files

## Prerequisites

Before running the tests, ensure:

1. The development server is running on `http://localhost:5173`
2. All dependencies are installed (`npm install`)

## How to Run the Test Suite

### Start the Development Server

```bash
npm run dev
```

This starts the app at `http://localhost:5173`.

### Run All Tests

```bash
npx cypress run
```

This runs all tests in headless mode (no browser UI). Results will display in the terminal.

### Run Tests in Interactive Mode

```bash
npx cypress open
```

This opens the Cypress Test Runner with a GUI where you can:

- Select which test files to run
- Watch tests execute in real-time
- Debug failed tests with the dev tools

### Run a Specific Test File

```bash
npx cypress run --spec "cypress/e2e/navigation.cy.ts"
```

### Run Tests Matching a Keyword

```bash
npx cypress run --grep "collapse"
```

## File Structure

```
cypress/
├── config/                 # (Future) Test configuration files
│
├── e2e/                    # End-to-end test files
│   ├── locators.ts         # Reusable CSS/XPath selectors
│   └── navigation.cy.ts    # Navigation tests
│
├── fixtures/               # Static test data (JSON, images, etc.)
│   └── example.json        # Example fixture file
│
├── support/                # Global test configuration
│   ├── commands.ts         # Custom Cypress commands
│   └── e2e.ts             # Global before/after hooks
│
├── TESTING_PLAN.md         # Testing strategy and roadmap
│
└── README.md              # This file
```

### File Descriptions

| File                  | Purpose                                          |
| --------------------- | ------------------------------------------------ |
| `cypress.config.ts`   | Cypress configuration (baseUrl, viewport, etc.)  |
| `e2e/locators.ts`     | Centralized selector definitions for UI elements |
| `e2e/*.cy.ts`         | Individual test suites organized by feature      |
| `fixtures/`           | JSON files with mock data for tests              |
| `support/commands.ts` | Custom commands (e.g., `cy.login()`)             |
| `support/e2e.ts`      | Global hooks and configuration                   |

## Writing Tests

### Test Structure

```typescript
import locators from "./locators";

describe("Feature Name", () => {
  beforeEach(() => {
    // Runs before each test - reset state, visit page, etc.
    cy.visit("/");
  });

  it("User can perform action", () => {
    // Arrange - get the element
    cy.get(locators.navigation.navBarCollapse)
      .should("be.visible") // Assert element is visible
      .and("not.be.disabled"); // Assert element is enabled

    // Act - interact with the element
    cy.get(locators.navigation.navBarCollapse).click();

    // Assert - verify the outcome
    cy.get(locators.navigation.navExpand).should("exist");
  });
});
```

### Using Locators

All selectors should be defined in `locators.ts` for maintainability:

```typescript
// locators.ts
const navigation = {
  navBarCollapse: '[aria-label="Collapse sidebar"]',
  navExpand: 'button[aria-label="Expand sidebar"]',
  navToggle: '[aria-label="Collapse sidebar"], [aria-label="Expand sidebar"]',
};

export default { navigation };
```

Then use in tests:

```typescript
cy.get(locators.navigation.navBarCollapse).click();
```

## Troubleshooting

### Tests Failing Due to Timing

If tests fail with "element not found" or "timed out":

1. **Add explicit assertions** - Use `.should("exist")` or `.should("be.visible")` which triggers Cypress's retry mechanism
2. **Wait for React to render** - Cypress auto-waits, but for React state changes add a short wait: `cy.wait(100)`
3. **Check for hydration issues** - Clear localStorage in `beforeEach`:
   ```typescript
   beforeEach(() => {
     cy.clearLocalStorage();
     cy.visit("/");
   });
   ```

### Opening the DevTools Console

When running tests, you can see what's happening by:

1. Run `npx cypress open`
2. Click on a test file
3. Use the DevTools panel in Cypress to inspect network requests, console logs, and DOM state

### Common Cypress Commands

| Command             | Description                  |
| ------------------- | ---------------------------- |
| `cy.visit(url)`     | Navigate to a URL            |
| `cy.get(selector)`  | Find an element              |
| `cy.click()`        | Click an element             |
| `cy.type(text)`     | Type into an input           |
| `cy.should()`       | Assert condition             |
| `cy.contains(text)` | Find element containing text |
| `cy.window()`       | Access window object         |
| `cy.location()`     | Get URL location             |

## Adding New Tests

1. Create a new file in `cypress/e2e/` with the naming convention `*.cy.ts`
2. Import locators from `./locators`
3. Write your tests following the structure above
4. Add selectors to `locators.ts` as needed

## CI Integration

To run Cypress in CI:

```bash
# In your CI pipeline
npm run dev &
npx cypress run --config baseUrl=http://localhost:5173
```

---

For more information, visit the [Cypress Documentation](https://docs.cypress.io/).
