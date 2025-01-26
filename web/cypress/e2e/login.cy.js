describe('Navigate after login', () => {
    it('should go to add ad after login', () => {

      cy.visit('http://localhost:3000');
   
      cy.get('[data-test-id="add-button"]').click();
      
      cy.url().should('include', '/login');

      cy.get('[data-test-id="login-email-input"] input').type("cosmin.albulescu@gmail.com");
      cy.get('[data-test-id="login-password-input"] input').type("@Access12345678");
   
      cy.get('[data-test-id="login-submit"]').click();

      cy.url().should('include', '/u/anunturi/creaza')
    })
})