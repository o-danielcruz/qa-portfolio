# Cypress E2E Test Suite — SauceDemo

Automated end-to-end test suite for [SauceDemo](https://www.saucedemo.com), a sample e-commerce application commonly used for QA practice and testing framework evaluation.

## About this project

This project demonstrates practical test automation skills using **Cypress**, covering the full user journey from login through order confirmation. Tests are structured following industry best practices: clear naming, reusable commands, and isolated test scenarios.

## Test coverage

| Suite | File | Scenarios |
|-------|------|-----------|
| Authentication | `01_authentication.cy.js` | Valid login, invalid credentials, locked-out user, logout |
| Product Catalog | `02_product_catalog.cy.js` | Product listing, sorting (A-Z, Z-A, price), product detail navigation |
| Shopping Cart | `03_shopping_cart.cy.js` | Add/remove items, badge counter, cart persistence |
| Checkout Flow | `04_checkout_flow.cy.js` | Form validation, order summary, price calculation, confirmation |

**Total: 30 automated test scenarios**

## Tech stack

- [Cypress](https://www.cypress.io/) — E2E testing framework
- JavaScript (ES6+)
- Node.js

## Project structure

```
cypress/
├── e2e/
│   ├── 01_authentication.cy.js
│   ├── 02_product_catalog.cy.js
│   ├── 03_shopping_cart.cy.js
│   └── 04_checkout_flow.cy.js
├── support/
│   ├── commands.js      # Custom reusable commands
│   └── e2e.js           # Global configuration
cypress.config.js
package.json
```

## Getting started

**Requirements:** Node.js 16+

```bash
# Clone the repository
git clone https://github.com/o-danielcruz/qa-portfolio.git
cd qa-portfolio/automation

# Install dependencies
npm install

# Run all tests (headless)
npx cypress run

# Open Cypress UI (interactive)
npx cypress open
```

## Custom commands

| Command | Description |
|---------|-------------|
| `cy.login(username, password)` | Logs in with given credentials (defaults to standard_user) |
| `cy.addToCartByName(productName)` | Adds a product to the cart by its display name |

## Test design principles

- **Isolation** — each test sets up its own state via `beforeEach`, no shared state between tests
- **Readability** — descriptive `describe/context/it` blocks that read like plain English
- **Resilience** — selectors use `data-test` attributes where available, not fragile CSS classes
- **Reusability** — common actions abstracted into custom commands to reduce duplication

## Author

**Daniel Cruz** — QA Engineer  
[linkedin.com/in/o-danielcruz](https://linkedin.com/in/o-danielcruz) · [danielcruz906@gmail.com](mailto:danielcruz906@gmail.com)
