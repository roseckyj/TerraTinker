# === BUILDER ===
FROM node:21-alpine as builder

# Install dependencies
RUN corepack enable && corepack prepare pnpm@latest --activate

# Build the web
WORKDIR /app
COPY ./package.json ./
COPY ./pnpm-lock.yaml ./
RUN pnpm i
COPY . ./
RUN pnpm run build


# === RUNNER ===
FROM nginx:alpine

# Copy the web build
RUN mkdir /app
COPY --from=builder /app/build /app

# Copy the nginx config
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf
