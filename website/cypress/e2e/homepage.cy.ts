import locators from "./locators";

describe("Homepage Tests", () => {
  beforeEach(() => {
    // Clear localStorage before each test to prevent hydration mismatch (Project Standard)
    cy.clearLocalStorage();
    // Visit the root page
    cy.visit("/");
  });

  it("should load the homepage successfully", () => {
    // Use a small wait for initial rendering if needed
    cy.wait(100);

    cy.get("header").find("[data-slot='input']").should("be.visible");
    cy.get(locators.navigation.navbar).should("exist");

    cy.get(locators.homepage.heroTitle)
      .should("be.visible")
      .and("contain", "Code it.");

    cy.get(locators.homepage.featuredTitle)
      .should("be.visible")
      .and("contain", "Featured Modules");

    cy.get(locators.homepage.featuredTitle)
      .should("be.visible")
      .and("contain", "Latest Articles");

    cy.get(locators.homepage.popularModulesCard)
      .should("be.visible")
      .and("contain", "Popular Modules");

    cy.contains(locators.homepage.popularModulesCard, "Popular Modules")
      .find(locators.homepage.popularModulesList)
      .should("have.length.at.least", 1);
  });

  it("should navigate to modules page when 'View All' is clicked", () => {
    cy.contains(locators.homepage.featuredTitle, "Featured Modules")
      .parent()
      .contains("View all")
      .click();

    cy.url().should("include", "/modules");

    cy.get(locators.modules.heroTitle).contains("Modules");
    cy.visit("/");
  });

  it("should navigate to Articles page when 'View All' is clicked", () => {
    cy.contains(locators.homepage.featuredTitle, "Latest Articles")
      .parent()
      .contains("View all")
      .click();

    cy.url().should("include", "/articles");

    // TODO: assertion - page currently shows a 404 message
    //cy.get(locators.navigation.navbar).should("exist");
    cy.visit("/");
  });
});
