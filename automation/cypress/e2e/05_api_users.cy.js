/// <reference types="cypress" />

/**
 * Test Suite: API Testing — Users
 *
 * Covers CRUD operations on the /users endpoint
 * using ReqRes (https://reqres.in) — a public REST API
 * designed for testing and prototyping.
 *
 * Tests validate: status codes, response structure,
 * data types, and business logic.
 */
describe('API — Users', () => {

  const baseUrl = 'https://reqres.in/api';

  context('GET /users', () => {

    it('should return 200 and a list of users', () => {
      cy.request('GET', `${baseUrl}/users?page=1`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).to.be.an('array');
        expect(response.body.data.length).to.be.greaterThan(0);
      });
    });

    it('should return correct pagination fields', () => {
      cy.request('GET', `${baseUrl}/users?page=1`).then((response) => {
        expect(response.body).to.have.all.keys('page', 'per_page', 'total', 'total_pages', 'data', 'support');
        expect(response.body.page).to.eq(1);
        expect(response.body.per_page).to.be.a('number');
      });
    });

    it('should return users with required fields', () => {
      cy.request('GET', `${baseUrl}/users?page=1`).then((response) => {
        response.body.data.forEach((user) => {
          expect(user).to.have.all.keys('id', 'email', 'first_name', 'last_name', 'avatar');
          expect(user.id).to.be.a('number');
          expect(user.email).to.include('@');
          expect(user.avatar).to.include('https://');
        });
      });
    });

    it('should return different users on page 2', () => {
      cy.request('GET', `${baseUrl}/users?page=1`).then((page1) => {
        cy.request('GET', `${baseUrl}/users?page=2`).then((page2) => {
          const ids1 = page1.body.data.map((u) => u.id);
          const ids2 = page2.body.data.map((u) => u.id);
          const overlap = ids1.filter((id) => ids2.includes(id));
          expect(overlap).to.have.length(0);
        });
      });
    });

  });

  context('GET /users/:id', () => {

    it('should return 200 and correct user data for valid id', () => {
      cy.request('GET', `${baseUrl}/users/2`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data.id).to.eq(2);
        expect(response.body.data.email).to.be.a('string');
        expect(response.body.data.first_name).to.be.a('string');
      });
    });

    it('should return 404 for non-existent user', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/users/9999`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.deep.eq({});
      });
    });

  });

  context('POST /users', () => {

    it('should create a new user and return 201', () => {
      const newUser = { name: 'Daniel Cruz', job: 'QA Engineer' };

      cy.request('POST', `${baseUrl}/users`, newUser).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.name).to.eq(newUser.name);
        expect(response.body.job).to.eq(newUser.job);
        expect(response.body.id).to.be.a('string');
        expect(response.body.createdAt).to.be.a('string');
      });
    });

    it('should return a unique id for each created user', () => {
      const user = { name: 'Test User', job: 'QA' };

      cy.request('POST', `${baseUrl}/users`, user).then((res1) => {
        cy.request('POST', `${baseUrl}/users`, user).then((res2) => {
          expect(res1.body.id).to.not.eq(res2.body.id);
        });
      });
    });

  });

  context('PUT /users/:id', () => {

    it('should update user and return 200 with updated data', () => {
      const updatedUser = { name: 'Daniel Cruz', job: 'Senior QA Engineer' };

      cy.request('PUT', `${baseUrl}/users/2`, updatedUser).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.name).to.eq(updatedUser.name);
        expect(response.body.job).to.eq(updatedUser.job);
        expect(response.body.updatedAt).to.be.a('string');
      });
    });

    it('should return updatedAt timestamp in ISO format', () => {
      cy.request('PUT', `${baseUrl}/users/2`, { name: 'Test', job: 'QA' }).then((response) => {
        const date = new Date(response.body.updatedAt);
        expect(date.toString()).to.not.eq('Invalid Date');
      });
    });

  });

  context('PATCH /users/:id', () => {

    it('should partially update user and return 200', () => {
      cy.request('PATCH', `${baseUrl}/users/2`, { job: 'Lead QA' }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.job).to.eq('Lead QA');
        expect(response.body.updatedAt).to.be.a('string');
      });
    });

  });

  context('DELETE /users/:id', () => {

    it('should delete user and return 204 with empty body', () => {
      cy.request('DELETE', `${baseUrl}/users/2`).then((response) => {
        expect(response.status).to.eq(204);
        expect(response.body).to.be.empty;
      });
    });

  });

});
