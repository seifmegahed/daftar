describe("Admin Page Tests", () => {
  before(() => {
    cy.clearAllCookies();
    // Login
    cy.visit("localhost:3000/");

    cy.get("#scroll-to-bottom").click({ force: true });
    const usernameField = cy.get("#username");
    const passwordField = cy.get("#password");

    const username = Cypress.env("username") as string;
    const password = Cypress.env("password") as string;

    usernameField.type(username);
    passwordField.type(password);
    cy.get("#submit-button").click();

    cy.url().should("eq", "http://localhost:3000/en");
  });

  beforeEach(() => {
    cy.visit("localhost:3000/admin");
    cy.url().should("include", "/admin");
  });

  it("should render", () => {
    cy.get("#layout-title").contains("Admin");
  });
});
