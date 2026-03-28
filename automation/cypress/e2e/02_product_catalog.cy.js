/// <reference types="cypress" />

/**
 * Test Suite: Product Catalog
 *
 * Covers product listing, sorting, filtering,
 * and product detail page navigation.
 */
describe('Product Catalog', () => {

  beforeEach(() => {
    cy.login();
  });

  context('Product listing', () => {

    it('should display all 6 products on inventory page', () => {
      cy.get('.inventory_item').should('have.length', 6);
    });

    it('should display product name, price and image for each item', () => {
      cy.get('.inventory_item').each(($item) => {
        cy.wrap($item).find('.inventory_item_name').should('not.be.empty');
        cy.wrap($item).find('.inventory_item_price').should('not.be.empty');
        cy.wrap($item).find('img').should('be.visible');
      });
    });

  });

  context('Sorting', () => {

    it('should sort products by name A to Z', () => {
      cy.get('.product_sort_container').select('az');

      cy.get('.inventory_item_name').then(($items) => {
        const names = [...$items].map((el) => el.innerText);
        const sorted = [...names].sort();
        expect(names).to.deep.equal(sorted);
      });
    });

    it('should sort products by name Z to A', () => {
      cy.get('.product_sort_container').select('za');

      cy.get('.inventory_item_name').then(($items) => {
        const names = [...$items].map((el) => el.innerText);
        const sorted = [...names].sort().reverse();
        expect(names).to.deep.equal(sorted);
      });
    });

    it('should sort products by price low to high', () => {
      cy.get('.product_sort_container').select('lohi');

      cy.get('.inventory_item_price').then(($prices) => {
        const prices = [...$prices].map((el) => parseFloat(el.innerText.replace('$', '')));
        const sorted = [...prices].sort((a, b) => a - b);
        expect(prices).to.deep.equal(sorted);
      });
    });

    it('should sort products by price high to low', () => {
      cy.get('.product_sort_container').select('hilo');

      cy.get('.inventory_item_price').then(($prices) => {
        const prices = [...$prices].map((el) => parseFloat(el.innerText.replace('$', '')));
        const sorted = [...prices].sort((a, b) => b - a);
        expect(prices).to.deep.equal(sorted);
      });
    });

  });

  context('Product detail', () => {

    it('should navigate to product detail page when clicking product name', () => {
      cy.get('.inventory_item_name').first().then(($name) => {
        const productName = $name.text();
        cy.wrap($name).click();

        cy.url().should('include', '/inventory-item.html');
        cy.get('.inventory_details_name').should('have.text', productName);
      });
    });

    it('should display product description, price and image on detail page', () => {
      cy.get('.inventory_item_name').first().click();

      cy.get('.inventory_details_name').should('be.visible');
      cy.get('.inventory_details_desc').should('not.be.empty');
      cy.get('.inventory_details_price').should('not.be.empty');
      cy.get('.inventory_details_img').should('be.visible');
    });

    it('should return to product list when clicking Back to products', () => {
      cy.get('.inventory_item_name').first().click();
      cy.get('[data-test="back-to-products"]').click();

      cy.url().should('include', '/inventory');
      cy.get('.inventory_list').should('be.visible');
    });

  });

});
