![Banner](public/img/ssr_editor.jpg)

<div align="center">

The backend of a starter project for the [DV1677 JSRamverk](https://jsramverk.se) course.

[![cov](https://robjoh01.github.io/ssr-editor-backend/badges/coverage.svg)](https://github.com/robjoh01/ssr-editor-backend/actions)
![Stars](https://img.shields.io/github/stars/robjoh01/ssr-editor-backend)

![Issues](https://img.shields.io/github/issues/robjoh01/ssr-editor-backend)
![Closed issues](https://img.shields.io/github/issues-closed/robjoh01/ssr-editor-backend)
![Pull requests](https://img.shields.io/github/issues-pr/robjoh01/ssr-editor-backend)
![Closed pull requests](https://img.shields.io/github/issues-pr-closed/robjoh01/ssr-editor-backend)

</div>

## Overview

SSR-Editor uses **WebSockets** for real-time communication, enabling live collaboration on documents. **MongoDB** serves as the database, handling document storage and retrieval, ensuring all changes are saved efficiently. The backend manages synchronization between users and maintains data consistency during collaborative editing.

## Frameworks & Libraries

- [MongoDB](https://www.mongodb.com)
- [Node.js](https://nodejs.org)
- [NPM](https://www.npmjs.com)
- [Express](https://expressjs.com)
- [Eslint](https://eslint.org)
- [Mocha](https://mochajs.org)
- [Chai](https://www.chaijs.com)

## Getting Started

1. Create an `.env` file in the project root with the following content:
   ```bash
   PORT=8080
   NODE_ENV="<test|production>"
   DB_USER="<username>"
   DB_PASS="<password>"
   ```

2. Install the necessary dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm run start
   ```

## Testing

1. To run unit tests:
   ```bash
   npm run test
   ```

2. To generate and view the test coverage report:
   ```bash
   npm run coverage
   ```