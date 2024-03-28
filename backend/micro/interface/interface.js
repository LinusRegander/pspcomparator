'use strict'

const klarnaServer = require('../services/klarna/server');
const strapiServer = require('../services/strapi/server');
const testKlarnaOrder = require('../test_data/klarna_test_order')
const axios = require('axios');
require('dotenv').config({ path: '../../.env' });


async function run() {
    //start services (specify port numbers here or get them from .env file for later use?)
    
    strapiServer.startServer(/**PORT?*/);
    klarnaServer.startServer(/**PORT?*/);

    
    // const strapiResponse = await axios.get('http://localhost:3001/api/strapi/findall/items');
    // const strapiData = strapiResponse.data;
    // console.log(strapiData);
    
    const klarnaOrder = testKlarnaOrder.klarnaTestOrder;
    const body = {
        order: klarnaOrder,
        username: process.env.KLARNA_USERNAME,
        password: process.env.KLARNA_PASSWORD
    }

    const klarnaResponse = await axios.post(`http://localhost:3002/api/klarna/start_session`, {body});
    const klarnaData = klarnaResponse.data;
    console.log(klarnaData);
    }

run()