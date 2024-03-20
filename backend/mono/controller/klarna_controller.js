const widgetBuilder = require('../view/widgetbuilder');
const auth = require('../model/auth');
const klarna = require('../model/klarna_endpoints');
const endpoint = require('../model/endpoints');
const interface = require('../view/interface');
require('dotenv').config({path: '../../.env'});

const username = process.env.KLARNA_USERNAME;
const password = process.env.KLARNA_PASSWORD;
const orderInfoText = 'Select the ID of the order you want to create a transaction for';

let sessionInfo = {
  sessionId: "",
  clientToken: ""
};

const order = {
  "order_amount": 10000,
  "order_lines": [
    {
      "name": "Ikea stol",
      "quantity": 10,
      "total_amount": 10000,
      "unit_price": 1000,
      "total_discount_amount": 0,
      "type": "physical"
    }
  ],
  "purchase_country": "SE",
  "purchase_currency": "SEK",
  "intent": "buy",
  "locale": "en-SE",
  billing_address: {
      given_name: "Alice",
      family_name: "Test",
      email: "customer@email.se",
      street_address: "Södra Blasieholmshamnen 2",
      postal_code: "11148",
      city: "Stockholm",
      phone: "+46701740615",
      country: "SE"
  },
  shipping_address: {
      given_name: "Alice",
      family_name: "Test",
      email: "customer@email.se",
      street_address: "Södra Blasieholmshamnen 2",
      postal_code: "11148",
      city: "Stockholm",
      phone: "+46701740615",
      country: "SE"
  },
  customer: {
      date_of_birth: "1941-03-21",
  },
}

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

async function createType(type, token, order) {
  try {
    if (!type) {
      throw Error('Cannot find matching type');
    }

    if (!type) {
      throw Error('User not allowed to make choice');
    }
    
    let res = null;

    if (type === 'Session') {
      res = await klarna.create(type, order, token);
      console.log(res);
      let sessionId = res.sessionId;
      let clientToken = res.clientToken;
      sessionInfo = { sessionId, clientToken };
    }

    if (type === 'Order') {
      widgetBuilder.createHTMLPageWithToken(sessionInfo.clientToken, order)
    }

    console.log(`Klarna ${type} created successfully.`, res);
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
    let order = await endpoint.findAll('Order');
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

async function makeAction(type, action, loginToken) {
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
          let orderInfo = await endpoint.findOne(orderId, 'Order');
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
          
          await createType(type, token, order);
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