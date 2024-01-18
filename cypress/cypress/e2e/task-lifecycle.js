describe("TaskMaster Task Life Cycle Test", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000");

    // Login
    cy.xpath("//a[text()='Login']").click();
    cy.get('[id="emailAddress"]').type("test@test");
    cy.get('[id="password"]').type("password");
    cy.xpath('//button[text()="Login"]').click();

    // Open Tasks
    cy.xpath("//a[text()='Tasks']").click();

    // Add new Task

    const taskName = "Cypress Task";
    cy.xpath("//button[text()='New Task']").click();
    cy.get('[id="taskName"]').type(taskName);
    cy.get('[id="dateDue"]').type("2024-01-31");
    cy.xpath("//button[text()='Add Task']").click();

    cy.contains("td", taskName).parents("tr").should("exist");

    // Complete Task
    cy.contains("td", taskName).parents("tr").find('[id="Complete"]').click();

    cy.contains("td", taskName)
      .parents("tr")
      .should("have.class", "line-through");

    // Reverse Complete
    cy.contains("td", taskName).parents("tr").find('[id="Complete"]').click();

    cy.contains("td", taskName)
      .parents("tr")
      .should("not.have.class", "line-through");

    // Delete Task
    cy.contains("td", taskName).parents("tr").find('[id="Delete"]').click();

    cy.xpath("//button[text()='Delete']").click();

    cy.contains("td", taskName).should("not.exist");

    // Go to Main
    cy.xpath("//a[text()='Main']").click();

    // Logout
    cy.xpath("//a[text()='Logout']").click();
  });
});
