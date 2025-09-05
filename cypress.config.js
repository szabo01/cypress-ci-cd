const { defineConfig } = require("cypress");
const mochawesome = require("cypress-mochawesome-reporter/plugin");

module.exports = defineConfig({
  reporter: "cypress-mochawesome-reporter",
  e2e: {
    setupNodeEvents(on, config) {
      mochawesome(on); // registra o plugin
      return config;
    },
  },
  reporterOptions: {
    reportDir: "cypress/reports/mochawesome-report",
    reportFilename: "mochawesome",
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    overwrite: true,
    json: false,
  },
});
