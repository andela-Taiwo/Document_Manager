[![Build Status](https://travis-ci.org/andela-Taiwo/Document_Manager.svg?branch=final-feedback-implementation)](https://travis-ci.org/andela-Taiwo/Document_Manager)

[![Code Climate](https://codeclimate.com/github/andela-Taiwo/Document_Manager/badges/gpa.svg)](https://codeclimate.com/github/andela-Taiwo/Document_Manager)
[![Coverage Status](https://coveralls.io/repos/github/andela-Taiwo/Document_Manager/badge.svg?branch=final-feedback-implementation)](https://coveralls.io/github/andela-Taiwo/Document_Manager?branch=final-feedback-implementation)

# RELIABLE-DOCS API
  Reliable-Docs API is an API  developed to enable user to track, manage and store documents.
  The end points can be accessed with Postman or alternate API toolchain.




Reliable-Docs  API is a document management system API, complete with roles and privileges. Each document defines access rights; the document defines which roles can access it. Also, each document specifies the date it was published. Users are categorized by roles. Each user must have a role defined for them.


  ## Features of RELIABLE-DOCS API

  This API has the following features.

  #### Authentication

  * JSON Web Token (JWT) is used to authenticate users.
  * The API creates a token everytime a user logs in.
  * The user supplies the token created, which is verified by the API before the user can access certain protected endpoints.

  #### Users

  * New users can sign up.
  * Signed up users can login and get an authentication token.
  * Users can update their details e.g. userName, email, and password.
  * An admin can get all users' data, change a user's role type, and delete a user.

  #### Roles

  * Every user must have a role defined for him/her (the default role is user).
  * The super admin can create new roles.
  * It restricts non super-admin from editing with roles.

  #### Documents

  * Logged in users can create documents.
  * All documents must have access type defined for them.
  * Supper admin can view all users' documents that are not private.
  * Users can view, update, and delete their documents.
  * Users cannot update and/or delete other users' documents.

  #### Documents Search

  * Users can search for and retrieve any document that is not private.
  * A Super-admin can search for and retrieve any user's information.


# Installation Guide
- Install Node JS and npm(Node Package Manager) [here](https://nodejs.org/en/) and install it.
- Clone this repository with "git clone https://github.com/andela-Taiwo/Document_Manager.git"
- run npm install to install the dependencies.
- Navigate into the cloned project directory.
 * Run the command `npm start:dev` to start the application.
* To run tests, run the command `npm test`.

## Documentation
Click [here](https://reliable-docs-api.herokuapp.com) to access the documentation


# System Dependecies

__What you need to run this app:__

- node and npm (brew install node)
- pgAdmin - Open Source administration and development platform for PostgreSQL

Technology
* [es6(ECMAScript 2015):](https://en.wikipedia.org/wiki/ECMAScript) es6 is the sixth major release of the javascript language specification. It enables features like constants, arrow functions, template literals, etc.

* [Express:](https://expressjs.com/) Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

* [Postgres:](https://www.postgresql.org/about/) PostgreSQL is a powerful, open source object-relational database system. It is used to persist Reliable-Docs API's data.

* [Babel:](https://babeljs.io/) Babel is used to transpile es6 down to es5.

* [Sequelize:](http://sequelize.readthedocs.io/en/v3/) Sequelize is a promise-based Obect Relational Mapper (ORM) for Node.js and io.js.
* [Postgres:](https://www.postgresql.org/about/) PostgreSQL is a powerful, open source object-relational database system. It is used to persist Reliable-Docs API's data.
- Chai - Chai is used together with jasmine to test this application
- Gulp - Was used for task runner
- jsonwebtoken - It was used for user authorization and authentication
- sequelize - Used for ORMs database
- babel-cli - It enables the app scripts to be tested with babel from the command line.

### The following depencies are required by the app during developmment
eslint - This is a javascript syntax highlighter used to highlight syntax error during the development of this app
gulp-nodemon - to watch the files in the directory for any files change
supertest - to run endpoint test


# Tests

The tests have been written using Gulp-Jasmine and Chai.

They are run using the coverage tool in order to generate test coverage reports.

-To run test

  $ npm test

# Contributing
[Click here for Contribution Guide](https://github.com/andela-Taiwo/Document_Manager/wiki/Contribution)
[Click here for Pull Request Guide](https://github.com/andela-Taiwo/Document_Manager/wiki/PR-Naming-Convention)



# License
This project is authored by Sokunbi Taiwo, and is licensed for use, distribution and modification under the MIT license
