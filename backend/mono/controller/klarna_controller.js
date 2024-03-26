const auth = require('../model/auth');
const widgetBuilder = require('../view/widget_builder');
const klarnaEndpoints = require('../model/klarna_endpoints');
const klarnaTestOrder = require('./test_data/klarna_test_order');
require('dotenv').config({path: '../../.env'});

const username = process.env.KLARNA_USERNAME;
const password = process.env.KLARNA_PASSWORD;

//global varable for storing session details (in case of bug/UIbreak)
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
    return auth.encodeCredentials(username, password);
  } catch (err) {
    console.log(err);
  }
}
/**
 * Starts a session in klarna, then uses the recieved client token to create html page with klarna widget
 * @param {string} klarnaCreds - base64 token for klarna authentication
 * @param {string} strapiOrderID - order ID in strapi used for callback
 * @param {object} klarnaOrder - klarna order object to be sent
 * @param {string} strapiCreds - strapi credentials for callback (OBS can be depreciated once klarna/receive_auth endpoint in place)
 */
async function createSession(klarnaCreds, strapiOrderID, klarnaOrder, strapiCreds) {
  try {
    //use order and klarna creds to create a session
    let res = await klarnaEndpoints.createSession(klarnaOrder, klarnaCreds);
    let sessionId = res.sessionId;
    let clientToken = res.clientToken;
    //save sessionId and clientToken to global object
    sessionInfo = { sessionId, clientToken };
    //create html page with klarna widget
    widgetBuilder.createHTMLPageWithToken(sessionInfo.clientToken, strapiCreds, strapiOrderID);
  } catch (err) {
    console.log(err);
  }
}
/**
 * Once authorised, uses auth-token and order object to create an order in klarna
 * @param {string} klarnaCreds - base64 token for klarna autShentication
 * @param {string} klarnaAuthToken - auth token recieved from authorisation callback
 * @param {object} klarnaOrder - klarna order object to be confirmed
 */
async function createOrder(klarnaCreds, klarnaAuthToken, klarnaOrder) {
  try {
    let res = await klarnaEndpoints.createOrder(klarnaOrder, klarnaAuthToken, klarnaCreds);
    console.log(`Klarna Order created successfully.`, res);
  } catch (err) {
    console.log(err);
  }
}
/**
 * Fetch the current klarna session, used in case of dropped connection, bugs etc
 * @param {string} klarnaCreds - base64 token for klarna authentication
 */
async function viewSession(klarnaCreds) {
  try {
    if (!klarnaCreds) {
      throw Error('No credentials found');
    }
    let id = sessionInfo.sessionId;
    if (!id) {
        throw new Error('Session ID is missing. Please create a session first');
    }
    let res = await klarnaEndpoints.view('session', id, klarnaCreds);
    console.log('Session: ', res);
  } catch (err) {
    console.log(err);
  }
}
/**
 * Switch case that chooses which method to call based on type/action chosen
 * @param {string} type 
 * @param {string} action - the action to be performed, create, update...
 * @param {object} data - contextual data such as objects or tokens
 * @param {string} strapiCreds - strapi token, temporarily needed for callback method
 */
async function makeAction(type, action, data, strapiCreds) {
  try {
    if (!type) {
      throw new Error('Invalid type');
    }
    if (!action) {
        throw new Error('Invalid command');
    }
    if (!auth) {
        throw new Error('Cannot authorize user with Klarna');
    }
    let klarnaCreds = await authenticate();
    switch (action) {
        case 'Payment': //used by buyer to start a payment with klarna
          console.log('Creating example order and starting session with Klarna');
          await createSession(klarnaCreds, data, klarnaTestOrder.klarnaTestOrder, strapiCreds);
          break;
        case 'Complete': //used by seller for completing an authorised order
          console.log('Confirming order with Klarna');
          await createOrder(klarnaCreds, data, klarnaTestOrder.klarnaTestOrder);
          break;
        case 'View': //used to fetch current session details
          await viewSession(klarnaCreds);
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