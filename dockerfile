ARG NODE_VERSION=24.9.0

# BUILD

FROM node:${NODE_VERSION}-alpine as build

WORKDIR /temp

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/temp/.npm \
    npm ci

USER node

COPY src src

RUN npm run build

# RUNNER

FROM node:${NODE_VERSION}-alpine as runner

WORKDIR /app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    npm ci --omit=dev

USER node

COPY --from=build /temp/dist/* .

EXPOSE 3000

CMD node --env-file .env index.js serve
