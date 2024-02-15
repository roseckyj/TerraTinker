# === BUILDER ===
FROM node:21-alpine as builder

# Install dependencies
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apk update && apk --no-cache add bash

# Setup the build environment
WORKDIR /app
COPY ./package.json ./
COPY ./pnpm-lock.yaml ./
RUN pnpm i
COPY . ./

# Set the version of the minecraft server
ARG MINECRAFT_MAJOR
ARG MINECRAFT_MINOR
ARG MINECRAFT_PATCH
ENV MINECRAFT_MAJOR $MINECRAFT_MAJOR
ENV MINECRAFT_MINOR $MINECRAFT_MINOR
ENV MINECRAFT_PATCH $MINECRAFT_PATCH
RUN chmod +x scripts/set-version.sh
RUN bash scripts/set-version.sh

# Build the web
RUN pnpm run build


# === RUNNER ===
FROM nginx:alpine

# Copy the web build
RUN mkdir /app
COPY --from=builder /app/build /app

# Copy the nginx config
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf
