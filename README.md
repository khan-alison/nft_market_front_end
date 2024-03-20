You can see full demo in link http://139.180.205.124/

## Installation

bash
$ npm install

## Running the app

bash
$ cp .env.dev .env

# development
$ npm run start
$ npm run start:dev
$ npm run start:staging
$ npm run start:prod


It open to http://localhost:3000

## Running the app production

bash
# change config production in the .env
$ npm run build 
$ npm run build:dev
$ npm run build:staging
$ npm run build:prod
# then
$ docker compose up

Go to ${ip_address} (if you run in the local, go to http://localhost)

build docker
docker build -t registry.gitlab.com/nft-marketplace-with-social-login/frontend-user:dev .
docker push registry.gitlab.com/nft-marketplace-with-social-login/frontend-user:dev