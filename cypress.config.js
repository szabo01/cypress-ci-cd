const path = require('path');

module.exports = {
  e2e: {
    setupNodeEvents(on, config) {
      require(path.join(__dirname, 'node_modules/cypress-mochawesome-reporter/plugin'))(on);
      return config;
    },
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      reportDir: 'cypress/reports/mochawesome-report',
      overwrite: false,
      html: false,
      json: true,
      charts: true,
      embeddedScreenshots: true,
      inlineAssets: true,
      saveAllAttempts: false
    }
  }
};
