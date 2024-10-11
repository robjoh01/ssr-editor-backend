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
- [Passport.js](https://www.passportjs.org)
- [Socket.io](https://socket.io)
- [Node.js](https://nodejs.org)
- [Express](https://expressjs.com)
- [Jest](https://jestjs.io)
- [Eslint](https://eslint.org)
- [NPM](https://www.npmjs.com)

## Getting Started

1. Create an `.env` file in the project root with the following content:
   ```bash
   PORT=<your_port> # Server's port
   DB_USER="<your_username>" # MongoDB's username
   DB_PASS="<your_password>" # MongoDB's password
   SALT_ROUNDS=<your_salt_rounds> # For password hashing
   JWT_SECRET=<your_jwt_secret> # For token signing
   SAVE_DELAY=<your_save_delay> # In milliseconds (delay between saving changes for a document)
   ```

   Create a `.env.development` file with the following content:
   ```bash
   NODE_ENV="development"
   ```

   Create a `.env.production` file with the following content:
   ```bash
   NODE_ENV="production"
   ```

2. Install the necessary dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm run start
   ```

4. Test the application:
   ```bash
   npm run test
   ```