'use strict'

const klarnaServer = require('../services/klarna/server');
const strapiServer = require('../services/strapi/server');
const axios = require('axios');

async function run() {
    //start services (specify port numbers here or get them from .env file for later use?)
    
    strapiServer.startServer(/**PORT?*/);
    klarnaServer.startServer(/**PORT?*/);

    
    const response = await axios.get('http://localhost:3001/api/strapi/findall/items');
    const res = response.data;
    console.log(res);
    

    // const order = {
    //     Object: "Test"
    // }

    // const response = await axios.post(`http://localhost:3002/api/klarna/create_session/${order}`);
    // const res = response.data;
    // console.log(res);
}

run()