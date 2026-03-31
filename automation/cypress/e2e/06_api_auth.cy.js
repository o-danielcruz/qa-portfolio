/// <reference types="cypress" />

/**
 * Test Suite: API Testing — Authentication
 *
 * Covers login and registration endpoints,
 * including success and error scenarios.
 */
describe('API — Authentication', () => {

  const baseUrl = 'https://reqres.in/api';

  context('POST /register', () => {

    it('should register successfully with valid credentials', () => {
      cy.request('POST', `${baseUrl}/register`, {
        email: 'eve.holt@reqres.in',
        password: 'pistol',
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.token).to.be.a('string');
        expect(response.body.token).to.have.length.greaterThan(0);
        expect(response.body.id).to.be.a('number');
      });
    });

    it('should return 400 when password is missing', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/register`,
        body: { email: 'eve.holt@reqres.in' },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.error).to.eq('Missing password');
      });
    });

    it('should return 400 when email is not registered', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/register`,
        body: { email: 'unknown@email.com', password: '1234' },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.error).to.be.a('string');
      });
    });

  });

  context('POST /login', () => {

    it('should login successfully and return a token', () => {
      cy.request('POST', `${baseUrl}/login`, {
        email: 'eve.holt@reqres.in',
        password: 'cityslicka',
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.token).to.be.a('string');
        expect(response.body.token).to.have.length.greaterThan(0);
      });
    });

    it('should return 400 when password is missing', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/login`,
        body: { email: 'eve.holt@reqres.in' },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.error).to.eq('Missing password');
      });
    });

    it('should return 400 when email is missing', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/login`,
        body: { password: 'cityslicka' },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.error).to.eq('Missing email or username');
      });
    });

    it('should return 400 for unregistered user', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/login`,
        body: { email: 'nobody@email.com', password: 'wrong' },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.error).to.be.a('string');
      });
    });

  });

});
