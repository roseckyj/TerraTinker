FROM node:23-alpine

# Install dependencies
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apk update && apk --no-cache add bash

# Setup the environment
WORKDIR /app
COPY ./package.json ./
COPY ./pnpm-lock.yaml ./
RUN pnpm i
COPY . ./

# Run the app
CMD ["pnpm", "start"]
