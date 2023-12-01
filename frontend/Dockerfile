FROM node:18-alpine

WORKDIR /taskmaster/

COPY src /taskmaster/src
COPY public /taskmaster/public
COPY package.json /taskmaster/

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]