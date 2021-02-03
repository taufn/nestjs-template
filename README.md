# NestJS Template

Reusable template for my NestJS apps.

## Features

Existing:

-   [x] Build with hexagonal architecture.
-   [x] One code base, multiple applications.
-   [x] Comes with:
    -   [x] TypeORM to assist database access.
    -   [x] Argon2 hashing for securing password (or secret).
    -   [x] Swagger docs using `@nestjs/swagger`.

Future plan:

-   [ ] RabbitMQ services.
-   [ ] Run integration and end-to-end tests inside Docker, to ensure tests closely reflect the real world situation.
-   [ ] Dockerfile to build an image for the app.
-   [ ] Pipeline template for GitLab.
-   [ ] Pipeline template for GitHub.

# Getting Started

## Cloning

Using `git`.

-   `git clone` the repo, go into the cloned directory.
-   `rm -rf .git` to remove existing repo.
-   `git init` to start a new repo with this project.

Using [degit](https://github.com/Rich-Harris/degit).

-   `degit git@github.com:taufn/nestjs-template.git`.
-   You can then `cd to/the/app` and `git init` a new repo.

## Setting Up

-   `yarn install` dependencies.
-   Setup test env.
    -   `cp ./config/env/.env.example ./config/env/.env.test`.
    -   Update variables as necessary.
-   Setup development env.
    -   `cp ./config/env/.env.example ./.env`.
    -   Update variables as necessary.

### ~~ESLint in VSCode~~

~~At this point, VSCode is not going to pick up your new `.ts` file automatically. To solve this, perform the following steps.~~

-   ~~Copy the content of `.eslintrc.json` to a new file. No need to save it as it will be temporary.~~
-   ~~Run `yarn eslint --init`.~~
-   ~~Answer the prompted questions accordingly.~~
    -   ~~Answer `No` **when asked about installing the dependencies**.~~
-   ~~Put back the content of `.eslintrc.json` above.~~

### JWT

Generate a random string for your JWT secret. It's fine to use any random string for development or test environment. But use stronger, generated string on live envs.

On Mac you can generate `JWT_SECRET` using `openssl rand -base64 32`. With `32` indicates the length of the random string to print.

---

*TODO:*

-   Explain hexagonal architecture.
-   Explain module dependencies.
-   Explain creating various apps from single code base.
-   Explain naming convention (and other conventions).
-   ...
