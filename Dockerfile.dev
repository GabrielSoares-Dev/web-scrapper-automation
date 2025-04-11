FROM node:18-alpine

RUN apk update && \
    apk add --no-cache git bash

WORKDIR /app

COPY package*.json .

COPY . . 

RUN npm i

CMD ["sh"]