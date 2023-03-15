FROM node:16

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
COPY lerna.json ./


COPY packages/quick-question/package.json ./packages/quick-question/
COPY packages/quick-question-indexer/package.json ./packages/quick-question-indexer/

RUN yarn

COPY . .

RUN yarn lerna run build

CMD [ "yarn", "lerna", "run", "start", "--scope=quick-question"]
