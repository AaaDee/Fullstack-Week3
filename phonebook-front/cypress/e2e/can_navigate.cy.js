describe('Pokemon page', function() {
  it('can navigate to pokemon page', function() {
    cy.visit('http://localhost:5000')
    cy.get('a[href*="ivysaur"]').click()
    cy.contains('chlorophyll')
  })
})