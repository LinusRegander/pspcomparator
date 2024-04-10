const axios = require('axios');

require('dotenv').config({ path: '../../.env'});

const klarnaURL = process.env.STRAPI_KLARNA_URL;

async function createSession(order, token) {
    try {
        const res = await axios.post(`${klarnaURL}create_session`, {
            order: order,
            token: token
        });

        return res.data;
    } catch (error) {
      console.error('Error creating a Klarna session:', error);
    }
}

async function createOrder(order, authtoken, token) {
  try {
      const response = await axios.post(`${klarnaURL}create_order`, {
        order: order,
        authToken: authtoken,
        token: token
    });

    return response.data;
  } catch (error) {
    console.error('Error creating a Klarna order:', error);
  }
}
async function view(type, sessionId, token) {
  try {
      const res = await axios.post(`${klarnaURL}view_${type.toLowerCase()}`, {
        sessionId: sessionId,
        token: token
      });

      return res.data;
  } catch (error) {
    console.error('Error retrieving type:', error);
  }
}

module.exports = {
    createOrder,
    createSession,
    view
}