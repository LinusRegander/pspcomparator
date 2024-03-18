const widgetBuilder = require('../view/widgetbuilder');
const auth = require('../model/auth');
const klarna = require('../model/klarna_endpoints');
require('dotenv');

const username = 'PK250364_e8c5dc522820';
const password = 'IEW5fYfsXOx9Nu32';

let sessionInfo = {
  sessionId: "",
  clientToken: ""
};

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

async function authenticate() {
  try {
    return await auth.getEncodedCredentials(username, password);
  } catch (err) {
    console.log(err);
  }
}

async function createType(type, token) {
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

async function makeAction(type, action) {
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
          console.log(type);
          await createType(type, token);
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