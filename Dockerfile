FROM node:16.13.2-alpine as base

ENV NODE_ENV=production

WORKDIR /app

####################
##### Sources ######
####################

# Backend 
FROM base as bsources

COPY backend/package.json backend/
COPY backend/yarn.lock backend/
COPY backend/prisma backend/prisma

RUN yarn --cwd backend install --production=false
RUN yarn --cwd backend prisma generate

# Frontend 
FROM base as fsources

COPY frontend/package.json frontend/
COPY frontend/yarn.lock frontend/

RUN yarn --cwd frontend install --production=false

####################
### Dependencies ###
####################

# Backend
FROM bsources as dependencies

RUN yarn --cwd backend install --frozen-lockfile --force --production --ignore-scripts --prefer-offline

####################
###### Build #######
####################

# Backend
FROM bsources as bbuild

COPY backend/tsconfig.json backend/
COPY backend/tsconfig.build.json backend/
COPY backend/src backend/src
COPY backend/types backend/types

RUN yarn --cwd backend build

# Frontend
FROM fsources as fbuild

COPY frontend/tsconfig.json frontend/
COPY frontend/tsconfig.build.json frontend/
COPY frontend/vite.config.ts frontend/
COPY frontend/index.html frontend/
COPY frontend/public frontend/public
COPY frontend/src frontend/src

RUN yarn --cwd frontend build

####################
##### Release ######
####################

FROM base as release

ENV PUBLIC_DIR=/app/dist/public

COPY --from=dependencies --chown=node:node /app/backend/node_modules/ /app/node_modules/
COPY --from=bbuild --chown=node:node /app/backend/dist/ /app/dist/
COPY --from=fbuild --chown=node:node /app/frontend/dist/ /app/dist/public

# Create upload directory
RUN mkdir /app/data
RUN chown -R node:node /app/data

# Create session directory
RUN mkdir /app/sessions
RUN chown -R node:node /app/sessions

# Create logs directory
RUN mkdir /app/dist/logs
RUN chown -R node:node /app/dist/logs

USER node

CMD ["yarn", "--cwd", "dist/backend", "start"]
