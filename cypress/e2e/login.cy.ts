const skip: Record<string, boolean> = {
  // skipNoInput: true,
  // skipShortUsername: true,
  // skipShortPassword: true,
  // skipLongUsername: true,
  // skipLongPassword: true,
  // skipUsernameNotFound: true,
  // skipIncorrectPassword: false,
  // skipCorrectCredentials: true,
};

describe("Login Page Tests", () => {
  before(() => {
    cy.clearAllCookies();
  });

  beforeEach(() => {
    cy.visit("localhost:3000");
    // cy.url().should("include", "/login");
    cy.get("#scroll-to-bottom").click({ force: true });
  });

  if (!skip.skipNoInput)
    it("should show error messages on no input", () => {
      const submitButton = cy.get("#submit-button");

      submitButton.click();

      cy.get("#username-message").contains("Username is required");
      cy.get("#password-message").contains("Password is required");
    });

  if (!skip.skipShortUsername)
    it("should show error message on short username", () => {
      const submitButton = cy.get("#submit-button");
      const userNameField = cy.get("#username");

      userNameField.type("a");
      submitButton.click();

      cy.get("#username-message").contains("Username must be at least");
    });

  if (!skip.skipShortPassword)
    it("should fail on short password", () => {
      cy.get("#scroll-to-bottom").click({ force: true });

      const submitButton = cy.get("#submit-button");
      const passwordField = cy.get("#password");

      passwordField.type("a");
      submitButton.click();

      cy.get("#password-message").contains("Password must be at least");
    });

  if (!skip.skipLongUsername)
    it("should show error message on long username", () => {
      cy.get("#scroll-to-bottom").click({ force: true });

      const submitButton = cy.get("#submit-button");
      const userNameField = cy.get("#username");

      userNameField.type("a".repeat(65));
      submitButton.click();

      cy.get("#username-message").contains("Username must not exceed");
    });

  if (!skip.skipLongPassword)
    it("should show error message on long password", () => {
      cy.get("#scroll-to-bottom").click({ force: true });

      const submitButton = cy.get("#submit-button");
      const userNameField = cy.get("#username");
      const passwordField = cy.get("#password");

      userNameField.type("abcd");
      passwordField.type("a".repeat(65));
      submitButton.click();

      cy.get("#password-message").contains("Password must not exceed");
    });

  if (!skip.skipUsernameNotFound)
    it("should show error message on username not found", () => {
      const submitButton = cy.get("#submit-button");
      const userNameField = cy.get("#username");
      const passwordField = cy.get("#password");

      userNameField.type("abcde");
      passwordField.type("abcdefghijklmnopqrstuvwxyz");
      submitButton.click();

      cy.get("div").contains("Username does not exist");
    });

  if (!skip.skipIncorrectPassword)
    it("should show error message on incorrect password", () => {
      const submitButton = cy.get("#submit-button");
      const userNameField = cy.get("#username");
      const passwordField = cy.get("#password");

      const username = Cypress.env("username") as string;
      userNameField.type(username);
      passwordField.type("invalidPassword1");

      submitButton.click();

      cy.get("div").contains("Incorrect password");
    });

  // Test locking account?

  if (!skip.skipCorrectCredentials)
    it("should login with correct credentials", () => {
      cy.get("#scroll-to-bottom").click({ force: true });

      const submitButton = cy.get("#submit-button");
      const userNameField = cy.get("#username");
      const passwordField = cy.get("#password");

      const username = Cypress.env("username") as string;
      const password = Cypress.env("password") as string;

      userNameField.type(username);
      passwordField.type(password);
      submitButton.click();

      cy.url().should("eq", "http://localhost:3000/en");
    });
});
