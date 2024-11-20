FROM node:20-alpine AS builder
ENV NODE_ENV production

RUN apk add --no-cache \
    udev \
    ttf-freefont \
    chromium

RUN which chromium-browser || true
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY server/package.json .
COPY server/yarn.lock .
RUN yarn install
COPY server/ .

EXPOSE 5000
CMD ["yarn", "start:prod"]
