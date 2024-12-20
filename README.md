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

1. Install the necessary dependencies:
   ```bash
   npm install
   ```

2. Create the following `.env` files in the root of your project:

- **.env**:
   ```bash
   # App
   PORT=1337 # Server's port
   SAVE_DELAY=300 # In milliseconds (delay between saving changes for a document)

   # bcrypt
   SALT_ROUNDS=<your_salt_rounds> # For password hashing

   # JWT Token
   JWT_SECRET=<your_jwt_secret> # For signing access tokens
   JWT_REFRESH_SECRET=<your_jwt_refresh_secret> # For signing refresh tokens
   JWT_ACCOUNT_SECRET=<your_jwt_account_secret> # For signing account verification tokens

   # Github Auth
   GITHUB_CLIENT_ID=<your_client_id> # GitHub's client ID
   GITHUB_CLIENT_SECRET=<your_client_secret> # GitHub's client secret>

   # Google Auth
   GOOGLE_CLIENT_ID=<your_client_id> # Google's client ID
   GOOGLE_CLIENT_SECRET=<your_client_secret> # Google's client secret

   # Mailgun
   MAILGUN_API_KEY="<your_api_key>" # Mailgun's API key
   MAILGUN_DOMAIN="<your_domain>" # Mailgun's domain
   MAILGUN_FROM="<your_email>" # Email address to send emails from

   # Database
   DB_USER=<your_username> # MongoDB's username
   DB_PASS=<your_password> # MongoDB's password
   ```

3. Start the application:
   ```bash
   npm run start
   ```

4. Test the application:
   ```bash
   npm run test
   ```