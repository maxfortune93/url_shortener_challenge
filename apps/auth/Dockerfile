
FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl procps

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

RUN npm install -g nodemon

COPY . .

RUN chown -R node:node /home/node/app

USER node

EXPOSE 3000

CMD ["nodemon", "--watch", "src", "--exec", "npm", "run", "start:dev"]
