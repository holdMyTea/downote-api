FROM node:current-alpine

RUN apk add git

WORKDIR /home/downote/app
COPY package*.json ./
RUN npm i

COPY . ./

CMD ["npm", "start"]
