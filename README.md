# Scrum board

Scrum board is a minimal scrum board.

## Installation

### With Docker

`docker pull saramorillon/scrum-board:latest`

### With docker-compose

You can use the [docker-compose.yml](./docker-compose.yml) provided as an example.

**:warning: Make sure that the `db`, `logs` and `upload` folder are writable by the container user (uid: 1000 - gid: 1000)**

### Using source code (production)

- Download the latest release of scrum-board
- Install packages using command `yarn install --production`
- Make sure that your system is configured with the appropriate environment variables (see below)
- Run project using command `yarn start`

### Using source code (development)

- Download the latest release of scrum-board
- Install packages using command `yarn install`
- Rename [.env.template](./.env.template) to `.env` and fill it with appropriate values
- Run project using command `yarn start:dev`

## Running Scrum board

Scrum board listens to port 3000

The default credentials are admin/admin.

## Environment variables

| Variable      | Value type                     | Default value | Description                                   |
| ------------- | ------------------------------ | ------------- | --------------------------------------------- |
| NODE_ENV      | development \| production      |               | Environment of the application                |
| APP_KEY       | string                         |               | App key for session                           |
| APP_PORT      | number                         | 80            | App port                                      |
| COOKIE_DOMAIN | string                         |               | Domain of the session cookie                  |
| LOG_LEVEL     | debug \| info \| warn \| error | info          | Level of the loger                            |
| SESSION_DIR   | string                         |               | Directory to store session                    |
| UPLOAD_DIR    | string                         |               | Directory to store attachments                |
| DB_HOST       | string                         |               | Database host                                 |
| DB_PORT       | number                         |               | Database port                                 |
| DB_USER       | string                         |               | Database user                                 |
| DB_PASSWORD   | string                         |               | Database password                             |
| DB_DATABASE   | boolean                        |               | Database name                                 |
| DB_LOGGING    | boolean                        | false         | Should DB queries be logged to console or not |
