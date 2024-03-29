'use strict'

const klarnaServer = require('../services/klarna/server');
const strapiServer = require('../services/strapi/server');
const testKlarnaOrder = require('../test_data/klarna_test_order')
const axios = require('axios');

const opn = require('opn');
const fs = require('fs');


require('dotenv').config({ path: '../../.env' });


async function run() {
    //start services (specify port numbers here or get them from .env file for later use?)
    
    strapiServer.startServer(/**PORT?*/);
    klarnaServer.startServer(/**PORT?*/);

    
    // const strapiResponse = await axios.get('http://localhost:3001/api/strapi/findall/items');
    // const strapiData = strapiResponse.data;
    // console.log(strapiData);
    
    //create some test objects to send to klarna service
    const klarnaOrder = testKlarnaOrder.klarnaTestOrder;
    const klarnaSessionObject = {
        order: klarnaOrder,
        username: process.env.KLARNA_USERNAME,
        password: process.env.KLARNA_PASSWORD
    }

    //start klarna session with test objects
    const klarnaSessionData = await axios.post(`http://localhost:3002/api/klarna/start_session`, {body: klarnaSessionObject});
    const klarnaSession = klarnaSessionData.data;
    console.log(klarnaSession);

    //use token and test strapi order to create widget
    const klarnaClientToken = klarnaSession.client_token;
    const strapiOrderID = 1;

    //get widget from klarna service
    const klarnaWidget = await axios.get(`http://localhost:3002/api/klarna/widget/${klarnaClientToken}/${strapiOrderID}`);
    console.log(klarnaWidget.data);
    // Write the HTML content to a file so we can open it
    fs.writeFile('../../public/klarna_widget.html', klarnaWidget.data, (err) => {
        if (err) throw err;
        console.log('HTML file created successfully');
        // Open the HTML file using opn
        opn('../../public/klarna_widget.html');
    });
    //now the auth_token should be present in the strapi-order (if authorised)
    const strapiOrder = await axios.get(`http://localhost:3001/api/strapi/find/orders/${strapiOrderID}`);
    const klarnaAuthToken = strapiOrder.data.data.attributes.klarna_auth_token;''
    console.log("auth token: ", klarnaAuthToken);

    //create order with klarna service
    const klarnaOrderID = await axios.post(`http://localhost:3002/api/klarna/create_order/${klarnaAuthToken}`, {body: klarnaSessionObject})

    console.log(klarnaOrderID.data);


    }

run()