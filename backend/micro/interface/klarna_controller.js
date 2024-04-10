const klarnaTestOrder = require('../test_data/klarna_test_order');
const axios = require('axios');
const opn = require('opn');
const fs = require('fs');

require('dotenv').config({path: '../../.env'});

const klarnaUsername = process.env.KLARNA_USERNAME;
const klarnaPassword = process.env.KLARNA_PASSWORD;
// const klarnaServiceURL = process.env.KLARNA_SERVICE_URL;
const klarnaServiceURL = "http://localhost:3002/api/klarna";


//global varable for storing session details (in case of bug/UIbreak)
let klarnaSessionObject = {
  username: process.env.KLARNA_USERNAME,
  password: process.env.KLARNA_PASSWORD
}

/**
 * Starts a session in klarna, then uses the recieved client token to create html page with klarna widget
 * @param {string} strapiOrderID - order ID in strapi used for callback
 * @param {object} klarnaOrder - klarna order object to be sent
 */
async function startSession(strapiOrderID, klarnaOrder) {
  try {
    //use order and klarna creds to create a session
    klarnaSessionObject.order = klarnaOrder;
    //TODO adjust endpoint in server to accept a strapiOrderID so it can update with sessionID
    const klarnaSessionData = await axios.post(`${klarnaServiceURL}/start_session`, {body: klarnaSessionObject});
    const klarnaSession = klarnaSessionData.data;
    console.log(klarnaSession.client_token);
    //save sessionId and clientToken to global object 
    //TODO check these exist before moving forward, adjust error message
    klarnaSessionObject.sessionID = klarnaSession.session_id;
    klarnaSessionObject.clientToken = klarnaSession.client_token;
    //get widget from klarna service
    const klarnaWidget = await axios.get(`${klarnaServiceURL}/widget/${klarnaSessionObject.clientToken}/${strapiOrderID}`);
    console.log(klarnaWidget.data);
    //write html to a file then display it
    fs.writeFile('../../public/klarna_widget.html', klarnaWidget.data, (err) => {
      if (err) throw err;
      console.log('HTML file created successfully');
      // Open the HTML file using opn
      opn('../../public/klarna_widget.html');
    });
    //if everything completed without errors, clear global object
    klarnaSessionObject.order = null;
    klarnaSessionObject.sessionID = null;
    klarnaSessionObject.clientToken = null;
  } catch (err) {
    console.log(err);
  }
}
/**
 * Once authorised, uses auth-token and order object to create an order in klarna
 * @param {string} klarnaAuthToken - auth token recieved from authorisation callback
 * @param {object} klarnaOrder - klarna order object for comparison
 */
async function createOrder(klarnaAuthToken, klarnaOrder) {
  try {
    //TODO check session object exists and has order data
    klarnaSessionObject.order = klarnaOrder
    //create order using klarna service
    const klarnaOrderID = await axios.post(`${klarnaServiceURL}/create_order/${klarnaAuthToken}`, {body: klarnaSessionObject})
    console.log(klarnaOrderID.data);
      //if everything completed without errors, clear global object
      klarnaSessionObject.order = null;
  } catch (err) {
    console.log(err);
  }
}
/**
 * Fetch the current klarna session, used in case of dropped connection, bugs etc
 */
async function viewSession(sessionID) {
  try {
    //TODO check session object exists and has session id
    //fetch session details using klarna service
    let res = await axios.post(`${klarnaServiceURL}/view_session/${sessionID}`, {body: klarnaSessionObject})
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
    switch (action) {
        case 'Payment': //used by buyer to start a payment with klarna
          console.log('Creating example order and starting session with Klarna');
          await startSession(data/*strapiOrderID*/, klarnaTestOrder.klarnaTestOrder);
          break; 
        case 'Complete': //used by seller for completing an authorised order
          console.log('Confirming order with Klarna');
          await createOrder(data/*strapiOrderID*/, klarnaTestOrder.klarnaTestOrder);
          break;
        case 'View': //used to fetch current session details
          console.log('Getting session details');
          await viewSession(data/*klarnaSessionID*/);
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