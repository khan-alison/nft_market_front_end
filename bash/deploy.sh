source ~/.nvm/nvm.sh
cd project/user-fe
git reset --hard
git pull origin develop
npm i --legacy-peer-deps
npm run build:dev
pm2 restart user-fe