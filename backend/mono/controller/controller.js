const users = require('../model/user');
const addresses = require('../model/address');
const items = require('../model/item');
const orders = require('../model/order');
const stocks = require('../model/stock');
const payments = require('../model/payment');
const auth = require('../model/auth');
const klarna = require('../../src/api/klarna/controllers/klarna');
const testOrder = require('../controller/test_data/testOrder');
const endpoints = require('../model/endpoints');
const interface = require('../view/interface');
const axios = require('axios');
const opn = require('opn');
require('dotenv').config();

const username = 'PK250364_e8c5dc522820';
const password = 'IEW5fYfsXOx9Nu32';
let loginToken = null;

const modelType = {
    User: users,
    Address: addresses,
    Item: items,
    Stock: stocks,
    Payment: payments,
    Order: orders
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

async function runProgram() {
          /*
async function setupInterface(controller) {
    console.log('Login user:')
    localToken = await controller.login();

    rl.question('Login user: ', async function question(choice) {
        switch(choice) {
            
        }
    });
}
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
        console.log(create.data.sessionId);

    await endpoints.sendClient('d1b164cd-5941-5136-8085-3b6f210bb93b', 'http://localhost:1337/api/klarna/send_token');
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
    */
}

async function makeAction(command, action) {
    try {
        const model = modelType[command];

        if (!model) {
            throw new Error('Invalid command');
        }
        
        switch (action) {
            case 'Create':
                if (model.create) {
                    await model.create();
                    break;
                } else {
                    throw new Error(`${action} not supported for ${command}`);
                }
            case 'Update':
                if (model.update) {
                    await model.update();
                    break;
                } else {
                    throw new Error(`${action} not supported for ${command}`);
                }
            case 'Find One':
                if (model.findOne) {
                    let id = await interface.getInfo(`Select ${command} ID`);
                    let item = await model.findOne(id);
                    console.log(item.data);
                    break;
                } else {
                    throw new Error(`${action} not supported for ${command}`);
                }
            case 'Find All':
                if (model.findAll) {
                    let items = await model.findAll();
                    console.log(items.data);
                } else {
                    throw new Error('Action not supported');
                }
                break;
            case 'Delete':
                if (model.delete) {
                    await model.delete();
                } else {
                    throw new Error('Action not supported');
                }
                break;
            default:
                break;
        }
    } catch (error) {
        console.error('Error making action:', error.message);
        throw error;
    }
}

async function logoutUser() {
    try {
        console.log('User logged out.');
        return loginToken = null;
    } catch (err) {
        console.log(err);
    }
}

async function loginUser() {
    try {
        let username = await interface.getInfo('Username');
        let password = await interface.getInfo('Password');
        return await auth.getToken(username, password);
    } catch (err) {
        console.log(err);
    }
}

async function authenticate() {
    try {
        if (!loginToken) {
            loginToken = await loginUser();
        }

        if (loginToken) {
            console.log('User authenticated and logged in.');
            return true;
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    makeAction,
    logoutUser,
    authenticate
}