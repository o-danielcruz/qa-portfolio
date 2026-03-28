/// <reference types="cypress" />

/**
 * Test Suite: Checkout Flow
 *
 * Covers the complete end-to-end purchase flow:
 * cart → checkout info → order summary → order confirmation.
 * Also covers form validation on the checkout info step.
 */
describe('Checkout Flow', () => {

  beforeEach(() => {
    cy.login();
    cy.addToCartByName('Sauce Labs Backpack');
    cy.get('.shopping_cart_link').click();
    cy.get('[data-test="checkout"]').click();
  });

  context('Checkout step 1 — Customer information', () => {

    it('should show error when submitting empty form', () => {
      cy.get('[data-test="continue"]').click();

      cy.get('[data-test="error"]')
        .should('be.visible')
        .and('contain', 'First Name is required');
    });

    it('should show error when last name is missing', () => {
      cy.get('[data-test="firstName"]').type('Daniel');
      cy.get('[data-test="postalCode"]').type('90000-000');
      cy.get('[data-test="continue"]').click();

      cy.get('[data-test="error"]')
        .should('be.visible')
        .and('contain', 'Last Name is required');
    });

    it('should show error when postal code is missing', () => {
      cy.get('[data-test="firstName"]').type('Daniel');
      cy.get('[data-test="lastName"]').type('Cruz');
      cy.get('[data-test="continue"]').click();

      cy.get('[data-test="error"]')
        .should('be.visible')
        .and('contain', 'Postal Code is required');
    });

    it('should proceed to order summary with valid information', () => {
      cy.get('[data-test="firstName"]').type('Daniel');
      cy.get('[data-test="lastName"]').type('Cruz');
      cy.get('[data-test="postalCode"]').type('90000-000');
      cy.get('[data-test="continue"]').click();

      cy.url().should('include', '/checkout-step-two');
      cy.get('.title').should('have.text', 'Checkout: Overview');
    });

  });

  context('Checkout step 2 — Order summary', () => {

    beforeEach(() => {
      cy.get('[data-test="firstName"]').type('Daniel');
      cy.get('[data-test="lastName"]').type('Cruz');
      cy.get('[data-test="postalCode"]').type('90000-000');
      cy.get('[data-test="continue"]').click();
    });

    it('should display the correct product in the order summary', () => {
      cy.contains('.cart_item', 'Sauce Labs Backpack').should('be.visible');
    });

    it('should display subtotal, tax and total price', () => {
      cy.get('.summary_subtotal_label').should('be.visible');
      cy.get('.summary_tax_label').should('be.visible');
      cy.get('.summary_total_label').should('be.visible');
    });

    it('should display correct total including tax', () => {
      cy.get('.summary_subtotal_label').then(($subtotal) => {
        const subtotal = parseFloat($subtotal.text().replace('Item total: $', ''));

        cy.get('.summary_tax_label').then(($tax) => {
          const tax = parseFloat($tax.text().replace('Tax: $', ''));

          cy.get('.summary_total_label').then(($total) => {
            const total = parseFloat($total.text().replace('Total: $', ''));
            expect(total).to.be.closeTo(subtotal + tax, 0.01);
          });
        });
      });
    });

  });

  context('Checkout step 3 — Order confirmation', () => {

    beforeEach(() => {
      cy.get('[data-test="firstName"]').type('Daniel');
      cy.get('[data-test="lastName"]').type('Cruz');
      cy.get('[data-test="postalCode"]').type('90000-000');
      cy.get('[data-test="continue"]').click();
      cy.get('[data-test="finish"]').click();
    });

    it('should show order confirmation after completing checkout', () => {
      cy.url().should('include', '/checkout-complete');
      cy.get('.complete-header').should('have.text', 'Thank you for your order!');
    });

    it('should clear the cart after order is placed', () => {
      cy.get('.shopping_cart_badge').should('not.exist');
    });

    it('should return to product list when clicking Back Home', () => {
      cy.get('[data-test="back-to-products"]').click();

      cy.url().should('include', '/inventory');
      cy.get('.inventory_list').should('be.visible');
    });

  });

});
