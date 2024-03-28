'use strict'

const klarnaServer = require('../services/klarna/server');
const strapiServer = require('../services/strapi/server');
const axios = require('axios');

async function run() {
    klarnaServer.startServer();
    strapiServer.startServer();

    // /*
    // const response = await axios.get('http://localhost:3000/api/strapi/findall/items');
    // const res = response.data;
    // console.log(res);
    // */

    // const order = {
    //     Object: "Test"
    // }

    // const response = await axios.post(`http://localhost:3001/api/klarna/create_session/${order}`);
    // const res = response.data;
    // console.log(res);
}

run()