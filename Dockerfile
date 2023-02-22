FROM node:16.13.2-alpine as base

ENV NODE_ENV=production

WORKDIR /app

####################
##### Sources ######
####################

# Backend 
FROM base as bsources

COPY back/package.json back/
COPY back/yarn.lock back/
COPY back/prisma back/prisma

RUN yarn --cwd back install --production=false
RUN yarn --cwd back prisma generate

# Frontend 
FROM base as fsources

COPY front/package.json front/
COPY front/yarn.lock front/

RUN yarn --cwd front install --production=false

####################
### Dependencies ###
####################

# Backend
FROM bsources as dependencies

RUN yarn --cwd back install --frozen-lockfile --force --production --ignore-scripts --prefer-offline

####################
###### Build #######
####################

# Backend
FROM bsources as bbuild

COPY back/tsconfig.json back/
COPY back/tsconfig.build.json back/
COPY back/src back/src
COPY back/types back/types

RUN yarn --cwd back build

# Frontend
FROM fsources as fbuild

COPY front/tsconfig.json front/
COPY front/tsconfig.build.json front/
COPY front/vite.config.ts front/
COPY front/index.html front/
COPY front/public front/public
COPY front/src front/src

RUN yarn --cwd front build

####################
##### Release ######
####################

FROM base as release

ENV PUBLIC_DIR=/app/dist/public

COPY --from=dependencies --chown=node:node /app/back/node_modules/ /app/node_modules/
COPY --from=bbuild --chown=node:node /app/back/dist/ /app/dist/
COPY --from=fbuild --chown=node:node /app/front/dist/ /app/dist/public

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

CMD ["yarn", "--cwd", "dist/back", "start"]
