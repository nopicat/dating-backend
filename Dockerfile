FROM node:18-slim As development

WORKDIR /api

ENV NODE_ENV development

RUN apt-get -y update
RUN apt-get -y upgrade

RUN apt-get -y install python3 make g++ openssl procps

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run prisma:generate

EXPOSE 3001

FROM node:16-slim as production

WORKDIR /api

ENV NODE_ENV production

RUN apt-get -y update
RUN apt-get -y upgrade

RUN apt-get -y install python3 make g++ openssl procps

COPY package*.json ./

RUN npm ci

RUN npm run prisma:generate
RUN npm run build

COPY . .

CMD ["npm", "run", "start:prod"]

EXPOSE 3001
