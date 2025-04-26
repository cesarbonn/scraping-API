# Full Stack Developer Take-Home Challenge

This repository contains the solution for the "Full Stack Developer Take-Home Challenge".

The project implements a **Financial Operations Backend Service** focused on fetching and managing exchange rates. It uses a scraping script to periodically fetch data, stores it in a database, and exposes it via a REST API.

## Implemented Features

* **Exchange Rate Fetching:** Scraping script that extracts rates from an external website.
* **Automation:** Scheduled task (Cron Job) to run the scraping periodically.
* **Data Storage:** Persistence of exchange rates in a database using Sequelize ORM.
* **REST API:** Endpoints for querying exchange rates (current and historical).
* **Tests:** Tests to verify the end points.
* **API Documentation:** Postman Collection to explore and test available endpoints.

## Technologies Used

* **Backend:** Node.js, TypeScript
* **Web Framework:** Express
* **ORM:** Sequelize
* **Database:** MySQL
* **Scraping:** axios, cheerio
* **Scheduled Tasks:** node-cron
* **Testing:** Jest,Supertest
* **Utilities:** cross-env, nodemon.

## Setup and Installation

Follow these steps to set up and run the project locally:

1.  **Prerequisites:**
    * Node.js (version v22.0.0 or higher) and npm.
    * A MySQL database server running locally or accessible.

2.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/cesarbonn/scraping-API.git](https://github.com/cesarbonn/scraping-API.git)
    ```

3.  **Navigate to Project Folder:**
    ```bash
    cd take-home-challenge
    ```

4.  **Install Dependencies:**

    This command reads your `package.json` file and automatically downloads all the required project packages (dependencies and devDependencies) into the `node_modules` folder. This step is necessary for the project code to function.

    ```bash
    npm install
    ```

    Or if you are using Yarn:

    ```bash
    yarn install
    ```

    This will install packages such as:

    * **Production Dependencies** (needed to run the application):
        `axios`, `cheerio`, `cors`, `cron`, `dotenv`, `express`, `mysql2`, `node-cron`, `nodemon`, `sequelize`
    * **Development Dependencies** (needed for building, testing, etc.):
        `@types/cors`, `@types/express`, `@types/jest`, `@types/node-cron`, `@types/supertest`, `cross-env`, `jest`, `supertest`, `ts-jest`, `tslint`, `typescript`

5.  **Database Configuration:**
    * Create a database named `node`.
    * Create a `.env` file in the root of the project.
    * Edit the newly created `.env` file and fill in your database connection credentials:
        ```env
        DB_DATABASE=node
        DB_USERNAME=your_user_name
        DB_PASSWORD=your_password
        DB_HOST=localhost
        DB_CONNECTION=mysql
        PORT='8000'
        ```
    * Save the `.env` file.

6. **Start the Server:**

    To start the backend server and begin fetching/serving data, run the following command:

    ```bash
    npm start
    ```

    This will typically start the Express server and the scheduled scraping task. The API will be available at `http://localhost:8000` (or the PORT specified in your `.env` file).
