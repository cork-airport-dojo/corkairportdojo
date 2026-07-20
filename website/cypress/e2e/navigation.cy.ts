import locators from "./locators";

describe("Navigation", () => {
  beforeEach(() => {
    // Clear localStorage before each test to prevent hydration mismatch
    cy.clearLocalStorage();
    cy.visit("/");
  });
  it("The user can collapse nav", () => {
    // cy.wait for the page to finish rendering
    cy.wait(100);
    cy.get(locators.navigation.navBarCollapse).should("exist");
    cy.get(locators.navigation.navBarCollapse).click();

    cy.get(locators.navigation.navExpand).should("exist");
    cy.get(locators.navigation.navExpand).click();
  });
});
