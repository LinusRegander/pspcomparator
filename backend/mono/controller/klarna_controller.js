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

/**
 * Gets login token from auth using username and password in .env
 * @returns base64 credential-string
 */
async function authenticate() {
  try {
    return await auth.getEncodedCredentials(username, password);
  } catch (err) {
    console.log(err);
  }
}
/**
 * 
 * @param {*} token 
 * @param {*} strapiOrderID 
 * @param {*} klarnaOrder 
 * @param {*} localToken 
 */
async function createSession(token, strapiOrderID, klarnaOrder, localToken) {
  try {
    
    let res = null;
    res = await klarna.createSession(klarnaOrder, token);
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
    console.log(`Klarna Session created successfully.`, res);
  } catch (err) {
    console.log(err);
  }
}
/**
 * 
 * @param {*} type 
 * @param {*} token 
 */
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
/**
 * 
 * @returns 
 */
async function getOrderList() {
  try {
    let order = await endpoints.findAll('Order');
    return order.data;
  } catch (err) {
    console.log(err);
  }
}
/**
 * 
 * @param {*} list 
 */
function viewList(list) {
  try {
    console.log(list);
  } catch (err) {
    console.log(err);
  }
}
/**
 * 
 * @param {*} type 
 * @param {*} action 
 * @param {*} data 
 * @param {*} loginToken 
 */
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