FROM node:lts-alpine

RUN apk update
RUN apk --no-cache add python g++ make

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

USER node

CMD ["yarn", "start"]
