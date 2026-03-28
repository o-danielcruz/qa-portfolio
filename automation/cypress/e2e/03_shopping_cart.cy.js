/// <reference types="cypress" />

/**
 * Test Suite: Shopping Cart
 *
 * Covers add to cart, remove from cart, cart badge counter,
 * and cart persistence across navigation.
 */
describe('Shopping Cart', () => {

  beforeEach(() => {
    cy.login();
  });

  context('Adding items', () => {

    it('should add a product to the cart and update badge counter', () => {
      cy.get('.inventory_item').first().find('button').click();

      cy.get('.shopping_cart_badge').should('have.text', '1');
    });

    it('should add multiple products and reflect correct count on badge', () => {
      cy.get('.inventory_item').eq(0).find('button').click();
      cy.get('.inventory_item').eq(1).find('button').click();
      cy.get('.inventory_item').eq(2).find('button').click();

      cy.get('.shopping_cart_badge').should('have.text', '3');
    });

    it('should change button label to Remove after adding product', () => {
      cy.get('.inventory_item').first().find('button').click();

      cy.get('.inventory_item').first()
        .find('button')
        .should('have.text', 'Remove');
    });

  });

  context('Removing items', () => {

    it('should remove product from cart and clear badge counter', () => {
      cy.get('.inventory_item').first().find('button').click();
      cy.get('.shopping_cart_badge').should('have.text', '1');

      cy.get('.inventory_item').first().find('button').click();
      cy.get('.shopping_cart_badge').should('not.exist');
    });

    it('should remove item from inside the cart page', () => {
      cy.addToCartByName('Sauce Labs Backpack');
      cy.get('.shopping_cart_link').click();

      cy.get('[data-test="remove-sauce-labs-backpack"]').click();

      cy.get('.cart_item').should('not.exist');
      cy.get('.shopping_cart_badge').should('not.exist');
    });

  });

  context('Cart page', () => {

    it('should display added products correctly on cart page', () => {
      cy.addToCartByName('Sauce Labs Backpack');
      cy.addToCartByName('Sauce Labs Bike Light');
      cy.get('.shopping_cart_link').click();

      cy.get('.cart_item').should('have.length', 2);
      cy.contains('.cart_item', 'Sauce Labs Backpack').should('be.visible');
      cy.contains('.cart_item', 'Sauce Labs Bike Light').should('be.visible');
    });

    it('should show empty cart when no items have been added', () => {
      cy.get('.shopping_cart_link').click();

      cy.get('.cart_item').should('not.exist');
    });

    it('should persist cart items when navigating back to product list', () => {
      cy.addToCartByName('Sauce Labs Backpack');
      cy.get('.shopping_cart_link').click();
      cy.get('[data-test="continue-shopping"]').click();

      cy.get('.shopping_cart_badge').should('have.text', '1');
    });

  });

});
