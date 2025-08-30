const { defineConfig } = require("cypress");

  module.exports = defineConfig({
    reporter: 'cypress-mochawesome-reporter',
    e2e: {
      setupNodeEvents(on, config) {
        return config;
      },
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
  });