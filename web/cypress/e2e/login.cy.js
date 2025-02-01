describe('Navigate after login', () => {
    it('should go to add ad after login', () => {

      cy.log("Open:", Cypress.env('URL'))

      cy.visit(Cypress.env('URL'));
   
      cy.get('[data-test="add-button"]').click();
      
      cy.url().should('include', '/login');

      cy.get('[data-test="login-email-input"] input').type("cosmin.albulescu@gmail.com");
      cy.get('[data-test="login-password-input"] input').type("@Access12345678");
   
      cy.get('[data-test="login-submit"]').click();

      cy.url().should('include', '/u/anunturi/creaza')
    })
})