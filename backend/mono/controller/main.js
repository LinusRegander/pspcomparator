const users = require('../model/user');
const auth = require('../model/auth');
const orders = require('../model/order');
const addresses = require('../model/address');
const klarna = require('../../src/api/klarna/controllers/klarna');
const testOrder = require('../controller/test_data/testOrder');
const endpoints = require('../model/endpoints');
const axios = require('axios');
const opn = require('opn');
require('dotenv').config();

const username = 'PK250364_e8c5dc522820';
const password = 'IEW5fYfsXOx9Nu32';
var localToken = '12313123123';

async function login() {
    let token = await auth.getToken('thatman', 'thispassword')
    localToken = token;
    console.log('User logged in with token: ', localToken);
}

async function createSession(order, token) {
    try {
        const response = await axios.post('http://localhost:1337/api/klarna/create_session', {
            order: order,
            token: token
        });

        return response;
    } catch (error) {
      console.error('Error creating a Klarna session:', error);
    }
}

async function viewSession(sessionId, token) {
  try {
      const response = await axios.post('http://localhost:1337/api/klarna/view_session', {
        sessionId: sessionId,
        token: token
      });

      return response;
  } catch (error) {
    console.error('Error creating a Klarna session:', error);
  }
}

async function createOrder(order, token) {
  try {
      const response = await axios.post('http://localhost:1337/api/klarna/create_order', {
        order: order,
        token: token
    });

    return response;
  } catch (error) {
    console.error('Error creating a Klarna session:', error);
  }
}

async function openWidget() {
  try {
      opn('http://localhost:1337/api/klarna/open_widget');
  } catch (error) {
    console.error('Error creating a Klarna session:', error);
  }
}

function getExampleOrder() {
  const order = {
    "order_amount": 100,
    "order_lines": [
      {
        "name": "Ikea stol",
        "quantity": 1,
        "total_amount": 100,
        "unit_price": 100
      }
    ],
    "purchase_country": "SE",
    "purchase_currency": "SEK"
  }
  return order
}

async function main() {
    
  //log in to strapi
  await login();
  console.log(localToken);
  //create order in strapi;
  let order = getExampleOrder();
  console.log(order)
  //start klarna session;
  let token = auth.getEncodedCredentials(username, password);
  console.log(token)
  let session = await createSession(order, token);
  console.log(session);
  //start klarna widget
  await endpoints.sendClient('d1b164cd-5941-5136-8085-3b6f210bb93b', 'http://localhost:1337/api/klarna/send_token');
  await openWidget();
  //get authToken from widget
  // await createOrder(authToken, localToken)

}

main();