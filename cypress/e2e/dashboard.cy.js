/// <reference types="cypress" />

// Smoke test: ensure dashboard renders program cards using real API or MSW mocks.
// Assumes user authentication token is stored in localStorage under 'token'.
// If backend requires auth, we store a dummy token so protected routes render.

context("Dashboard smoke test", () => {
  beforeEach(() => {
    // seed token so the app assumes an authenticated session
    window.localStorage.setItem(
      "token",
      "test.jwt.token",
    );
  });

  it("loads dashboard and shows program cards", () => {
    cy.visit("/");

    // The dashboard heading should be present
    cy.contains("Dashboard Overview").should("exist");

    // Wait for possible API requests and check at least one stat card is rendered
    cy.get("[data-testid*=stat-card-]").should("have.length.greaterThan", 0);
  });
});
