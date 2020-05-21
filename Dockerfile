FROM node:alpine

ADD . /app/
WORKDIR /app
EXPOSE 3000

RUN npm i --registry=https://registry.npm.taobao.org

RUN npm run tsc

CMD ["npm", "start"]
