FROM node:16-alpine 
# Set the working directory to /app inside the container
WORKDIR /app
# COPY package.json package-lock.json .
COPY . .
# RUN npm install -g yarn
RUN npm install -g yarn  --legacy-peer-deps --force
RUN npm i serve --global
RUN yarn install

# Copy app files

# ==== BUILD =====
# Build the app
RUN yarn build
# ==== RUN =======
# Expose the port on which the app will be running (3000 is the default that serve uses)
EXPOSE 3002
# Start the app
CMD [ "yarn", "start"]