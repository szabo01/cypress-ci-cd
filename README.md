 This project implements a CI/CD pipeline for end-to-end testing with [Cypress](https://www.cypress.io/) using Docker and GitHub Actions. Tests run in a Docker container (`cypress/included:13.14.0`), and reports are generated using `cypress-mochawesome-reporter` and published to GitHub Pages.

 ## Purpose
 Automate end-to-end testing for a sample to-do application and publish test reports to a publicly accessible GitHub Pages site.

 ## Technologies Used
 - **Cypress**: End-to-end testing framework.
 - **Docker**: Containerizes tests using `cypress/included:13.14.0`.
 - **GitHub Actions**: CI/CD pipeline for running tests and deploying reports.
 - **cypress-mochawesome-reporter**: Generates HTML test reports.
 - **GitHub Pages**: Hosts test reports.

 ## Prerequisites
 - **Docker Desktop**: Installed and configured (with WSL 2 integration on Windows).
 - **Node.js**: Version 20.x (included in the Docker container).
 - **Git**: For cloning the repository.
 - **WSL 2** (optional): For running on Windows with Ubuntu 24.04.

 ## Local Setup
 1. **Clone the repository**:
    ```bash
    git clone https://github.com/szabo01/cypress-ci-cd.git
    cd cypress-ci-cd
    ```
 2. **Build the Docker image**:
    ```bash
    docker build -t cypress-ci-cd .
    ```
 3. **Run the tests**:
    ```bash
    docker run --rm -v $(pwd):/app cypress-ci-cd npm run cy:report
    ```
    - Reports are generated at `cypress/reports/mochawesome-report/mochawesome.html`.

 ## CI/CD Pipeline
 - Configured in `.github/workflows/ci.yml`.
 - Triggered on pushes/pull requests to `main` and `develop` branches.
 - Steps:
   1. Check out the code.
   2. Set up Docker Buildx.
   3. Build the Docker image.
   4. Run Cypress tests.
   5. Generate and publish reports to GitHub Pages.

 ## Viewing Reports
 - **Main page**: [https://szabo01.github.io/cypress-ci-cd/](https://szabo01.github.io/cypress-ci-cd/)
   - Contains a link to the latest test report.
 - **Test report**: [https://szabo01.github.io/cypress-ci-cd/reports/<run_id>/mochawesome.html](https://szabo01.github.io/cypress-ci-cd/reports/<run_id>/mochawesome.html)
   - Replace `<run_id>` with the pipeline run ID (e.g., `17336169589`).
   - Example: [https://szabo01.github.io/cypress-ci-cd/reports/17336169589/mochawesome.html](https://szabo01.github.io/cypress-ci-cd/reports/17336169589/mochawesome.html)

 ## Project Structure
 ```
 cypress-ci-cd/
 ├── cypress/
 │   ├── e2e/
 │   │   └── todo.cy.js          # Cypress test files
 │   ├── reports/
 │   │   └── mochawesome-report/ # Locally generated reports
 │   └── support/
 │       ├── commands.js         # Custom commands
 │       └── e2e.js              # Global configuration
 ├── .github/
 │   └── workflows/
 │       └── ci.yml              # CI/CD pipeline
 ├── cypress.config.js            # Cypress configuration
 ├── Dockerfile                  # Docker container definition
 ├── package.json                # Dependencies and scripts
 └── README.md                   # Project documentation
 ```

 ## Contributing
 1. Fork the repository.
 2. Create a feature branch (`git checkout -b feature/new-feature`).
 3. Commit your changes (`git commit -m "Add new feature"`).
 4. Push to the branch (`git push origin feature/new-feature`).
 5. Open a Pull Request.

 ## Contact
 - Author: Robson Szabo
 - Email: robsonszabo@yahoo.com.br
 - GitHub: [szabo01](https://github.com/szabo01)
