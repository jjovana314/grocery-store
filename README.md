# Grocery Store Backend (NestJS + MongoDB)

This is a backend service for managing grocery stores, users, and store hierarchies.  
Built with **NestJS**, **Mongoose**, and **TypeScript**.

---

## Features

- User registration (Manager / Employee)
- Grocery hierarchy (country → region → city → store)
- MongoDB as the main database
- Data seeding for groceries and users
- Unit testing with Jest
- Configuration via environment variables

---

## Requirements

Before you begin, make sure you have installed:

- [Node.js](https://nodejs.org/en/) (>= 18)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally or via Docker)

---

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/jjovana314/grocery-store.git
cd grocery-store
npm install
```

Then open .env and set your MongoDB URL:
DATABASE_URL=your_mongodb_url

---

## Database Seeding

You can seed initial data (groceries and users) using the provided npm script.

```bash
npm run seed
```
This will:
- Clear existing grocery and user data
- Create grocery hierarchy (e.g. country → region → city → store)
- Add test users with hashed passwords

Make sure MongoDB is running locally before executing this command.

---

## Running Tests

Unit tests are written using Jest and NestJS TestingModule.

To run all tests:
```bash
npm run test
```
---

## Notes

- The app uses @golevelup/profiguration
- Passwords are hashed with bcrypt
- Logging is done via nestjs-pino
- Seeder script uses ts-node and tsconfig-paths/register to run TypeScript directly.

---

## Author

Developed by Jovana Jovanović
Contact: jjovana314@gmail.com

---

## License

MIT License

Copyright (c) 2025 Jovana Jovanović

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.

