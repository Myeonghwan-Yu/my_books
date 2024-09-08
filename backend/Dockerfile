FROM node:18-alpine

COPY ./package.json /myfolder/
COPY ./yarn.lock /myfolder/

WORKDIR /myfolder/

RUN yarn install

COPY . /myfolder/

CMD ["yarn", "start:dev"]
