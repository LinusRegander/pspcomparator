const auth = require('../model/auth');
const orders = require('../model/order');
const axios = require('axios');
const opn = require('opn');
const fs = require('fs');
const klarnaTestOrder = require('./test_data/klarna_test_order');
const widgetBuilder = require('../view/widget_builder');
const strapiTestOrder = require('./test_data/strapi_test_order');
require('dotenv').config({path: '../../.env'});
/**
 * Class for testing the authorisation flow of creating a session in klarna, getting authorisation, and finally creating an order in klarna
 */
const username = "PK250364_e8c5dc522820";
const password = "IEW5fYfsXOx9Nu32";

var strapiCreds = '12313123123';
/**
 * Login user to strapi and save token to global variable
 */
async function login(identifier, password) {
    let token = await auth.getStrapiCreds(identifier, password);
    strapiCreds = token;
    console.log('User logged in with token: ', strapiCreds);
}
/**
 * Send order object to strapi endpoint that creates a klarna session
 * @param {*} order 
 * @returns klarna session id
 */
async function createSession(order) {
    try {
        const response = await axios.post('http://localhost:1337/api/klarna/create_session', {
            order: order,
            token: auth.encodeCredentials(username, password)
        });

        return response;
    } catch (error) {
      console.error('Error creating a Klarna session:', error);
    }
}
/**
 * Send klarna authorisation token and order object to strapi endpoint that creates a klarna order
 * @param {*} order 
 * @param {*} authtoken 
 * @returns klarna order id
 */
async function createOrder(order, authtoken) {
  try {
      const response = await axios.post('http://localhost:1337/api/klarna/create_order', {
        order: order,
        authToken: authtoken,
        token: auth.encodeCredentials(username, password)
    });

    return response.data;
  } catch (error) {
    console.error('Error creating a Klarna order:', error);
  }
}

async function main() {
    
  //log in to strapi
  await login('thatman', 'thispassword');
  //create order;
  let order = klarnaTestOrder;
  //start klarna session;
  let session = await createSession(order);
  //specify strapi order number  
  const strapiOrderNo = strapiTestOrder.orderNumber;
  //start klarna widget
  widgetBuilder.createHTMLPageWithToken(session.data.clientToken, strapiCreds, strapiOrderNo);
  //check order periodically for status = 'Authenticated'
  let authToken = '';
  while(true) {
    await wait(5000);
    let strapiOrder = await orders.findOneOrder(strapiCreds, strapiOrderNo);
    if (strapiOrder.data.attributes.Status === "Authorized") {
      authToken = strapiOrder.data.attributes.klarna_auth_token;
      break;
    }
  }
  //use klarna auth token to create klarna order
  await createOrder(order, authToken);
}
/**
 * Simple wait function that returns after the specified time (ms)
 * @param {*} timeout 
 * @returns 
 */
function wait(timeout) {
  return new Promise(resolve => {
      setTimeout(resolve, timeout);
  });
}

main();