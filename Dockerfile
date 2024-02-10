FROM node:18-alpine

WORKDIR /OhMyDog-Web

COPY public/ /OhMyDog-Web/public
COPY src/ /OhMyDog-Web/src
COPY package.json /OhMyDog-Web/

RUN npm install

CMD ["npm", "start"]