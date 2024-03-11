const users = require('../model/user');
const auth = require('../model/auth');
const addresses = require('../model/address');
const klarna = require('../../src/api/klarna/controllers/klarna');
const testOrder = require('../controller/test_data/testOrder')
const axios = require('axios');
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
      const response = await axios.post('http://localhost:1337/api/klarna/open_widget');
      return response;
  } catch (error) {
    console.error('Error creating a Klarna session:', error);
  }
}

async function main() {
    try {/*
        let token = await auth.getEncodedCredentials(username, password);

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

        let create = await createSession(order, token);
        
        console.log(create);
*/
        await openWidget();

        //let view = await viewSession(create.data.sessionId, token);

        //let cOrder = await createOrder(order, token);

        //console.log(cOrder);
    } catch (error) {
        console.log(error);
    }

    //await login();
    //console.log(localToken)
    // let id = await users.findMe(localToken);
    
    //let address = {
       //Name: 'UPDATED'
    //}

    //await addresses.updateAddress(localToken, 24, address)
    // await users.findMe({

    // })
    // await users.findOneUser
    // await users.updateMe
}

main();