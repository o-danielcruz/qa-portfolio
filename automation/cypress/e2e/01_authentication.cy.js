/// <reference types="cypress" />

/**
 * Test Suite: Authentication
 * 
 * Covers login flows for SauceDemo application.
 * Tests both valid and invalid credential scenarios,
 * as well as edge cases like locked-out users.
 */
describe('Authentication', () => {

  beforeEach(() => {
    cy.visit('/');
  });

  context('Valid credentials', () => {

    it('should log in successfully with standard user', () => {
      cy.get('[data-test="username"]').type('standard_user');
      cy.get('[data-test="password"]').type('secret_sauce');
      cy.get('[data-test="login-button"]').click();

      cy.url().should('include', '/inventory');
      cy.get('.title').should('have.text', 'Products');
    });

    it('should display product list after successful login', () => {
      cy.login();

      cy.get('.inventory_list').should('be.visible');
      cy.get('.inventory_item').should('have.length.greaterThan', 0);
    });

  });

  context('Invalid credentials', () => {

    it('should show error message with wrong password', () => {
      cy.get('[data-test="username"]').type('standard_user');
      cy.get('[data-test="password"]').type('wrong_password');
      cy.get('[data-test="login-button"]').click();

      cy.get('[data-test="error"]')
        .should('be.visible')
        .and('contain', 'Username and password do not match');
    });

    it('should show error message with empty username', () => {
      cy.get('[data-test="password"]').type('secret_sauce');
      cy.get('[data-test="login-button"]').click();

      cy.get('[data-test="error"]')
        .should('be.visible')
        .and('contain', 'Username is required');
    });

    it('should show error message with empty password', () => {
      cy.get('[data-test="username"]').type('standard_user');
      cy.get('[data-test="login-button"]').click();

      cy.get('[data-test="error"]')
        .should('be.visible')
        .and('contain', 'Password is required');
    });

    it('should show error message for locked-out user', () => {
      cy.get('[data-test="username"]').type('locked_out_user');
      cy.get('[data-test="password"]').type('secret_sauce');
      cy.get('[data-test="login-button"]').click();

      cy.get('[data-test="error"]')
        .should('be.visible')
        .and('contain', 'Sorry, this user has been locked out');
    });

  });

  context('Logout', () => {

    it('should log out successfully and redirect to login page', () => {
      cy.login();

      cy.get('#react-burger-menu-btn').click();
      cy.get('#logout_sidebar_link').should('be.visible').click();

      cy.url().should('eq', Cypress.config('baseUrl') + '/');
      cy.get('[data-test="login-button"]').should('be.visible');
    });

  });

});
