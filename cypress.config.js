module.exports = {
  reporter: 'cypress-mochawesome-reporter',
  e2e: {
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      return config;
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    // baseUrl: 'http://localhost:3000'
  },
  reporterOptions: {
    reportDir: 'cypress/reports/mochawesome-report',
    reportFilename: 'mochawesome',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    overwrite: true,
    json: false
  }
};
