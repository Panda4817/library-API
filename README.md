# [Personal Library](https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/personal-library)
[![Run on Repl.it](https://repl.it/badge/github/panda4817/personal-library)](https://repl.it/@Panda4817/personal-library)

A freecodecamp project for the quality assurance certificate. A library API implementation using NodeJS, ExpressJS server and MongoDB database for storage of books. It follows CRUD principles. You can add books, update them with new comments, delete a book and delete all books. I have also added a frontend to test out API responses and wrote all 10 functional tests using Chai and Mocha.

## Usage on local machine

- Add `NODE_ENV=test` to `.env`
- Add `DB=<your database connection variable>` to `.env`
- Add `PORT=8080` to `.env`
- run `npm install && npm start` to run all 10 functional tests and start node server
- Open `localhost:8080` on browser to see frontend