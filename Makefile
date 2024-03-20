install:
	rm -rf yarn.lock node_modules
	git pull
	yarn install
	yarn build
	pm2 start "yarn start" --name user

build:
	rm -rf yarn.lock
	git pull
	yarn install
	yarn build
	pm2 restart user