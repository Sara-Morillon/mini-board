# Mini Git

Mini Git is a minimal UI for Git.

## Installation

### With Docker

`docker pull saramorillon/mini-board:latest`

### With docker-compose

You can use the [docker-compose.yml](./docker-compose.yml) provided as an example.

**:warning: Make sure that the `db` and `logs` folder are writable by the container user (uid: 1000 - gid: 1000)**

### Using source code (production)

- Download the latest release of mini-board
- Install packages using command `yarn install --production`
- Make sure that your system is configured with the appropriate environment variables (see below)
- Run project using command `yarn start`

### Using source code (development)

- Download the latest release of mini-board
- Install packages using command `yarn install`
- Rename [.env.template](./backend/.env.template) to `.env` and fill it with appropriate values
- Run project using command `yarn start:dev`

## Running Mini Git

Mini Git listens to port 80 by default.

The default credentials are admin/admin.

Make sure that `git` is installed on your server as git command are used by the backend (git is installed by default in the Dockerfile).

## Environment variables

| Variable      | Value type                | Default value | Description                                       |
| ------------- | ------------------------- | ------------- | ------------------------------------------------- |
| NODE_ENV      | development \| production |               | Environment of the application                    |
| APP_KEY       | string                    |               | App key for session                               |
| APP_PORT      | number                    | 80            | App port                                          |
| COOKIE_DOMAIN | string                    |               | Domain of the session cookie                      |
| SESSION_DIR   | string                    |               | Directory to store session                        |
| REPO_DIR      | string                    |               | Directory where repositories are stored           |
| DB_PATH       | string                    |               | Path of sqlite database                           |
| SERVER_URL    | string                    |               | URL of the Git server, used to clone repositories |
