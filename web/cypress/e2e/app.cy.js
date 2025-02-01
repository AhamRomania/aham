describe('Navigation', () => {
    it('should navigate to the category page', () => {
      
      cy.log("Open:", Cypress.env('URL')+'/vehicule')

      cy.visit(Cypress.env('URL')+'/vehicule')
   
      // Find a link with an href attribute containing "about" and click it
      cy.get('[data-test="logo"]').click({multiple: true})
   
      // The new url should include "/about"
      cy.url().should('include', '/')

      cy.get('h1').contains('Bazarul')
    })
})