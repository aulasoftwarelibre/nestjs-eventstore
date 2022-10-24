FROM node:16

WORKDIR /app

COPY example/package.json example/package-lock.json /app/
RUN npm install

COPY example/*.json /app/
COPY example/src/ /app/src/
COPY src/ /app/src/nestjs-eventstore/

CMD [ "npm", "run", "start:dev" ]
