FROM node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Copy everything in the same folder as Dockerfile?
COPY . .

EXPOSE 3000

CMD [ "node", "server.js" ]