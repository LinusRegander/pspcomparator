'use strict'

const StrapiController = require('../services/strapi/controller/controller');
const StrapiServer = require('../services/strapi/controller/server');
const axios = require('axios');

async function run() {
    const strapiServer = new StrapiServer();
    strapiServer.findAll();
    strapiServer.startServer();

    const response = await axios.get('http://localhost:3000/api/strapi/findall/items');
    const res = response.data;
    console.log(res);
}

run()