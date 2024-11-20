FROM node:20-alpine AS builder
ENV NODE_ENV production

WORKDIR /app

COPY client/package.json .
COPY client/yarn.lock .
RUN yarn install --frozen-lockfile
RUN rm -f .env
COPY client/src ./src
COPY client/public ./public

ARG REACT_APP_API
ARG REACT_APP_URL
ENV REACT_APP_API=${REACT_APP_API}
ENV REACT_APP_URL=${REACT_APP_URL}

RUN yarn build

FROM nginx:1.27.2-alpine AS production
ENV NODE_ENV production

COPY --from=builder /app/build /usr/share/nginx/html

COPY ./client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
