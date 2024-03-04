FROM node:18

WORKDIR /backend

RUN npm install -g eslint

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 1337

CMD ["npm", "run", "strapi", "start"]
