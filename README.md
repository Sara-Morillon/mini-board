# Mini Board

Mini Board is a minimal UI for Board.

## Installation

### With Docker

`docker pull saramorillon/mini-board:latest`

### With docker-compose

You can use the [docker-compose.yml](./docker-compose.yml) provided as an example.

**:warning: Make sure that the `data`, `sessions` and `logs` folder are writable by the container user (uid: 1000 - gid: 1000)**

### Using source code (production)

- Download the latest release of mini-board
- Install packages using command `yarn install --production`
- Make sure that your system is configured with the appropriate environment variables (see below)
- Run project using command `yarn start`

### Using source code (development)

- Download the latest release of mini-board
- Install packages using command `yarn install`
- Rename [.env.template](./back/.env.template) to `.env` and fill it with appropriate values
- Run project using command `yarn start:dev`

## Running Mini Board

Mini Board listens to port 80 by default.

The default credentials are admin/admin.

## Environment variables

| Variable         | Value type                | Default value | Description                              |
| ---------------- | ------------------------- | ------------- | ---------------------------------------- |
| NODE_ENV         | development \| production |               | Environment of the application           |
| APP_KEY          | string                    |               | App key for session                      |
| APP_PORT         | number                    | 80            | App port                                 |
| COOKIE_DOMAIN    | string                    |               | Domain of the session cookie             |
| COOKIE_HTTP_ONLY | boolean                   | true          | Should the session cookie be http only   |
| COOKIE_SECURE    | boolean                   | true          | Should the session cookie be secure      |
| COOKIE_MAX_AGE   | string                    | 1h            | Max age of the session cookie (ms)       |
| SESSION_DIR      | string                    |               | Directory to store session               |
| UPLOAD_DIR       | string                    |               | Directory where attachments are uploaded |
| DATABASE_URL     | string                    |               | URL of the database                      |
