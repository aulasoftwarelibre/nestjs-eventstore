FROM node:18

WORKDIR /app/

COPY example/package.json example/package-lock.json /app/
RUN npm install

COPY example/ /app/
COPY src/ /app/src/nestjs-eventstore/

CMD [ "npm", "run", "start:dev" ]
