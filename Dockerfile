FROM node:lts-alpine

RUN apk update
RUN apk --no-cache add git python g++ make

ENV NODE_ENV=production

WORKDIR /app

# Install packages
COPY package.json .
COPY yarn.lock .
RUN yarn install --production=false

# Copy sources
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY ormconfig.js .
COPY @types/ ./@types
COPY migrations ./migrations
COPY src ./src

# Build
RUN yarn build
RUN cp -r src/public dist/src/

RUN yarn install --force --production --ignore-scripts --prefer-offline
RUN rm -rf tsconfig.json tsconfig.build.json src @types

# Create repos directory
RUN mkdir /app/repos
RUN chown -R node:node /app/repos

# Create db directory
RUN mkdir /app/db
RUN chown -R node:node /app/db

# Create session directory
RUN mkdir /app/sessions
RUN chown -R node:node /app/sessions

# Create logs directory
RUN mkdir /app/dist/logs
RUN chown -R node:node /app/dist/logs

USER node

CMD ["yarn", "start"]
