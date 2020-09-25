# Self-care backend

## Getting started

- Create a `.env` file in the root directory by renaming the `.env.template` file. You will need the confidential information for some of the environment variables, which can be found [here](https://docs.google.com/document/d/1iOnGV6V8Q-RpNZ6mhbikR9qjsManuwVNP-AqbX_G_1E/edit?usp=sharing)
- Install [Docker](https://www.docker.com/) (if you don't already have it)
- Run `docker-compose up`
  - You may need to run `docker-compose build` or `docker-compose build --no-cache` first if the docker configurations were changed.
- Use `CTRL + C` to stop the process once you are done
- Run `docker-compose down`

## How to talk to DB?

We are using sequelize.js as ORM. All CRUD operations are done via sequelize in the backend.

## Testing API call

Example user flow:

- Create a guest account
- Write a journal entry
- Retrieve journal entry

### Postman

To execute the example user flow in Postman, do:

- Send a `GET` request to `localhost:3000/auth/guest`
  - Note down the access token
- Send a `POST` request to `localhost:3000/journal/page?date=YYYY-MM-DD` with the access token in the authorization header
  - example date: 2020-09-20
- Send a `GET` request to the same URL in the previous step with the access token in the authorization header
