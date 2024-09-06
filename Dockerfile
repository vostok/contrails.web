FROM docker-proxy.kontur.host/node:12 AS build-env

ADD . /app

WORKDIR /app

RUN yarn install && yarn run build


# build runtime image
FROM docker-proxy.kontur.host/nginx:alpine

WORKDIR /usr/share/nginx/html
COPY --from=build-env /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
