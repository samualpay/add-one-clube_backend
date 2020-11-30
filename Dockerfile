FROM node:12
WORKDIR /opt/workdir
COPY package*.json ./

RUN npm i

COPY src ./src
COPY tsconfig.json ./tsconfig.json
COPY build.sh ./build.sh

RUN npm run build

CMD npm start