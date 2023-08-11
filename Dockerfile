FROM ubuntu:latest
RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs
RUN apt-get install -y make gcc g++

ADD . /src
WORKDIR /src
RUN npm install
RUN npm run build
RUN npm run build:ui

FROM eyevinntechnology/srt-whep:v1.1.0

RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs

WORKDIR /app
COPY --from=0 /src/dist ./dist
COPY --from=0 /src/package.json ./
COPY --from=0 /src/package-lock.json ./
RUN npm install --omit=dev

ENTRYPOINT [ "node", "./dist/server.js" ]