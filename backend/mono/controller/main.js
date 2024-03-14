const users = require('../model/user');
const auth = require('../model/auth');
const orders = require('../model/order');
const payments = require('../model/payment');
const addresses = require('../model/address');
const widgetBuilder = require('../view/widgetbuilder');
const klarna = require('../../src/api/klarna/controllers/klarna');
const testOrder = require('../controller/test_data/testOrder');
const endpoints = require('../model/endpoints');
const axios = require('axios');

require('dotenv').config({path: '../../.env'});

const username = process.env.KLARNA_USERNAME;
const password = process.env.KLARNA_PASSWORD;
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



function createPayment(orderID) {
  //order, date, type
}

async function main() {
    
  //log in to strapi
  await login();
  console.log(localToken);
  //create order in strapi;
  let strapiOrder = orders.createStrapiOrderObject();
  let strapiOrderID = await orders.createOrder(localToken, strapiOrder)
  //create payment in strapi
  let strapiPayment = payments.createPaymentObject(strapiOrderID)
  let strapiPaymentID = await payments.createPayment(localToken, strapiPayment)
  console.log(strapiOrder)
  //create base64 credentials for klarna
  let klarnaCreds = auth.getEncodedCredentials(username, password);
  console.log(klarnaCreds)
  //create klarna order object
  let klarnaOrder = orders.createKlarnaOrderObject(strapiOrderID)
  //start klarna session;
  let session = await createSession(klarnaOrder, klarnaCreds);
  console.log(session.data);
  //start klarna widget
  widgetBuilder.createHTMLPageWithToken(session.data.clientToken, strapiOrderID)

}

main();