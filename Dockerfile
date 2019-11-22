FROM node:current-alpine

WORKDIR /home/dowmote/app
COPY package*.json ./
RUN npm i

COPY . ./

CMD ["npm", "test"]
