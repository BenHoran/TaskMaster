describe('TaskMaster Login Test', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000')
    cy.get('[id="username"]').type("testuser")
    cy.get('[id="password"]').type("password")
    cy.intercept('/api/tasks').as('tasks')
    cy.get('[id="login"]').click()
   
    cy.wait(['@tasks'])

    cy.get('[id="logout"]').click()
  })
})