FROM node:18

WORKDIR /backend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 1337

RUN eslint .

CMD ["npm", "run", "strapi", "start"]
