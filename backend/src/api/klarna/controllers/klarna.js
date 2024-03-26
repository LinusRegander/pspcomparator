'use strict';
const axios = require('axios');
require('dotenv').config();

const playgroundURL = process.env.KLARNA_PLAYGROUND_URL

/**
 * Creates an order using Klarna API.
 * @param {*} ctx - The context object containing required data.
 * @returns  - The response data from the Klarna API.
 */
async function createOrder(ctx) {
  try {

    let token = ctx.request.body.token;
    let order = ctx.request.body.order;
    let authToken = ctx.request.body.authToken;

    const headers = {
      Authorization: `Basic ${token}`,
      'Content-Type': 'application/json',
    }

    const res = await axios.post(`${playgroundURL}/payments/v1/authorizations/${authToken}/order`, order, { headers });

    return res.data;

  } catch (error) {
    console.error('Error creating an order', error);
  }
}

/**
 * Creates a session using Klarna API.
 * @param {*} ctx - The context object containing required data.
 * @returns  - Response data containing payment category headers, session ID, and client token.
 */
async function createSession(ctx) {
  try {

    let order = ctx.request.body.order;
    let token = ctx.request.body.token;

    const headers = {
      Authorization: `Basic ${token}`,
      'Content-Type': 'application/json'
    };

    const res = await axios.post(`${playgroundURL}/payments/v1/sessions`, order, { headers });

    return {
      paymentCategoryHeaders: res.data.payment_method_categories,
      sessionId: res.data.session_id,
      clientToken: res.data.client_token
    };

  } catch (error) {
    console.error('Error creating a Klarna session in Strapi', error);
  }
}

/**
 * Retrieves a session using Klarna API.
 * @param {*} ctx - The context object containing required data.
 * @returns - The session data retrieved from Klarna API.
 */
async function viewSession(ctx) {
  try {
    const sessionId = ctx.request.body.sessionId;
    const token = ctx.request.body.token;

    const headers = {
      Authorization: `Basic ${token}`,
      'Content-Type': 'application/json'
    };

    const res = await axios.get(`${playgroundURL}/payments/v1/sessions/${sessionId}`, { headers });

    return res.data; 

  } catch (error) {
    console.error('Error viewing a Klarna session in Strapi', error);
  }
}

module.exports = {
  createOrder,
  createSession,
  viewSession
};