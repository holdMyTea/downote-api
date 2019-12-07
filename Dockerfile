FROM node:current-alpine

WORKDIR /home/downote/app
COPY package*.json ./
RUN npm i

COPY . ./

CMD ["npm", "test"]
