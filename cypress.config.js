const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(_on, _config) {
      // implement node event listeners if needed
    },
    specPattern: "cypress/e2e/**/*.cy.js",
  },
});
