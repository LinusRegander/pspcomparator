const widgetBuilder = require('../view/widgetbuilder');
const auth = require('../model/auth');
const klarna = require('../model/klarna_endpoints');
const endpoints = require('../model/endpoints');
const interface = require('../view/interface');
const { testOrder } = require('./test_data/klarnaTestOrder');
require('dotenv').config({path: '../../.env'});

const username = process.env.KLARNA_USERNAME;
const password = process.env.KLARNA_PASSWORD;
const orderInfoText = 'Select the ID of the order you want to create a transaction for';

let sessionInfo = {
  sessionId: "",
  clientToken: ""
};


let orderTest = {
  order_amount: null,
  order_lines: [
    {
      name: null,
      quantity: null,
      total_amount: null,
      unit_price: null
    }
  ],
  purchase_country: null,
  purchase_currency: null
}
/*
const orderTemplate = {
  "order_amount": getInfo(),
  "order_lines": [
    {
      "name": item.name,
      "quantity": stock.amount,
      "total_amount": stock.total,
      "unit_price": item.price
    }
  ],
  "purchase_country": address.countryCode,
  "purchase_currency": countryCode[country]
}
*/

async function authenticate() {
  try {
    return await auth.getEncodedCredentials(username, password);
  } catch (err) {
    console.log(err);
  }
}

async function createSession(token, strapiOrderID, klarnaOrder, localToken) {
  try {
    
    let res = null;

    res = await klarna.createSession(klarnaOrder, token);
    console.log(res);
    let sessionId = res.sessionId;
    let clientToken = res.clientToken;
    sessionInfo = { sessionId, clientToken };
    widgetBuilder.createHTMLPageWithToken(sessionInfo.clientToken, localToken, strapiOrderID)
  

    console.log(`Klarna Session created successfully.`, res);
  } catch (err) {
    console.log(err);
  }
}
async function createOrder(token, klarna_auth_token, klarnaOrder) {
  try {
    
    let res = null;

    res = await klarna.createOrder(klarnaOrder, klarna_auth_token, token);
    console.log(res);
  

    console.log(`Klarna Session created successfully.`, res);
  } catch (err) {
    console.log(err);
  }
}

async function viewType(type, token) {
  try {
    if (!type) {
      throw Error('Cannot find matching type');
    }

    if (!token) {
      throw Error('User not allowed to make choice');
    }

    let id = sessionInfo.sessionId;

    if (!id) {
        throw new Error('Session ID is missing. Please create a session first');
    }

    let res = await klarna.view(type, id, token);

    console.log(`${type}`, res);
  } catch (err) {
    console.log(err);
  }
}

async function getOrderList() {
  try {
    let order = await endpoints.findAll('Order');
    return order.data;
  } catch (err) {
    console.log(err);
  }
}

function viewList(list) {
  try {
    console.log(list);
  } catch (err) {
    console.log(err);
  }
}

async function makeAction(type, action, data, loginToken) {
  try {
    if (!type) {
      throw new Error('Invalid type');
    }

    if (!action) {
        throw new Error('Invalid command');
    }

    let token = await authenticate();

    if (!auth) {
        throw new Error('Cannot authorize user with Klarna');
    }

    switch (action) {
        case 'Create':
          let list = await getOrderList();
          viewList(list);
          let orderId = await interface.getInfo(orderInfoText);
          let orderInfo = await endpoints.findOne(orderId, 'Order');
          console.log(orderInfo.data.attributes.Items.data.attributes);
          console.log(orderInfo.data.attributes.Items.data.attributes.Name);
          console.log(orderInfo.data.attributes.address.data);

          orderTest = {
            order_amount: 10,
            order_lines: [
              {
                name: orderInfo.data.attributes.Items.data.attributes.Name,
                quantity: null,
                total_amount: null,
                unit_price: null
              }
            ],
            purchase_country: orderInfo.data.attributes.address.attributes.Country_Code,
            purchase_currency: 'SEK'
          }
          break;
        case 'Payment':
          console.log('Creating example order and starting session with Klarna');
          await createSession(token, data, testOrder, loginToken);
          break;
        case 'Complete': //used by seller for completing an authorised order
          console.log('Creating order with Klarna');
          await createOrder(token, data, testOrder);
          break;
        case 'View':
          await viewType(type, token);
          break;
        default:
          break;
    }
  } catch (error) {
      console.error('Error making action:', error.message);
      throw error;
  }
}

module.exports = {
    makeAction
}