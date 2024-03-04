FROM node:18

WORKDIR /backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 1337

CMD ["npm", "run", "strapi", "start"]
