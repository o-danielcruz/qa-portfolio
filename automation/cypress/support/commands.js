// Custom commands for SauceDemo

/**
 * Login command - reusable across all test files
 * @param {string} username - SauceDemo username
 * @param {string} password - SauceDemo password
 */
Cypress.Commands.add('login', (username = 'standard_user', password = 'secret_sauce') => {
  cy.visit('/');
  cy.get('[data-test="username"]').clear().type(username);
  cy.get('[data-test="password"]').clear().type(password);
  cy.get('[data-test="login-button"]').click();
});

/**
 * Add a product to the cart by its name
 * @param {string} productName - Exact product name as shown on page
 */
Cypress.Commands.add('addToCartByName', (productName) => {
  cy.contains('.inventory_item', productName)
    .find('button')
    .click();
});
