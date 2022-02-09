FROM node:16.13.2-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

ENV TZ Asia/Tokyo
RUN apk add tzdata

COPY . .

EXPOSE 8080

CMD ["npm", "run", "start"]
