const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  e2e: {
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      return config;
    },
  },
  reporterOptions: {
    reportDir: 'cypress/reports/mochawesome-report',
    reportFilename: 'mochawesome',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    overwrite: true, // Sobrescreve o relatório a cada execução
    json: false // Evita geração de arquivos JSON
  }
});