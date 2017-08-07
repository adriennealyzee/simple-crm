# Node, React, and Mongoose/SQL #
 
A boilerplate for getting started with the best practices for building a web app.
 
## Getting started ##
To install: `npm install`

To run server: `npm start`

To run webpack: `npm run react-dev`

## Notes ##

### Database migrations ###
  1. You may need to: `npm install knex -g`. 
  2. Update your db with the latest migrations: `knex migrate:latest`
  3. Create new migration files: `knex migrate:make migration_name`
 
See http://knexjs.org/#Migrations for more information.
