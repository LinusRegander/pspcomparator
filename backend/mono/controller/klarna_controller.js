const auth = require('../model/auth');
const widgetBuilder = require('../view/widgetbuilder');
const klarnaEndpoints = require('../model/klarna_endpoints');
const klarnaTestOrder = require('./test_data/klarnaTestOrder');
require('dotenv').config({path: '../../.env'});

const username = process.env.KLARNA_USERNAME;
const password = process.env.KLARNA_PASSWORD;

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
    return await auth.encodeCredentials(username, password);
  } catch (err) {
    console.log(err);
  }
}
/**
 * Starts a session in klarna, then uses the recieved client token to create html page with klarna widget
 * @param {*} klarnaCreds 
 * @param {*} strapiOrderID 
 * @param {*} klarnaOrder 
 * @param {*} strapiCreds 
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
 * @param {*} klarnaCreds 
 * @param {*} klarnaAuthToken 
 * @param {*} klarnaOrder 
 */
async function createOrder(klarnaCreds, klarnaAuthToken, klarnaOrder) {
  try {
    let res = await klarnaEndpoints.createOrder(klarnaOrder, klarnaAuthToken, klarnaCreds);
    console.log(`Klarna Session created successfully.`, res);
  } catch (err) {
    console.log(err);
  }
}
/**
 * Fetch the current klarna session, used in case of dropped connection, bugs etc
 * @param {*} klarnaCreds 
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
 * @param {*} type 
 * @param {*} action 
 * @param {*} data //contextual data such as object Ids or tokens
 * @param {*} strapiCreds //temporarily needed for callback method
 */
async function makeAction(type, action, data, strapiCreds) {
  try {
    if (!type) {
      throw new Error('Invalid type');
    }
    if (!action) {
        throw new Error('Invalid command');
    }
    let klarnaCreds = await authenticate();
    if (!auth) {
        throw new Error('Cannot authorize user with Klarna');
    }
    switch (action) {
        case 'Payment': //used by buyer to start a payment with klarna
          console.log('Creating example order and starting session with Klarna');
          await createSession(klarnaCreds, data, klarnaTestOrder, strapiCreds);
          break;
        case 'Complete': //used by seller for completing an authorised order
          console.log('Confirming order with Klarna');
          await createOrder(klarnaCreds, data, klarnaTestOrder);
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