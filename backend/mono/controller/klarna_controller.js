const klarna = require('../../src/api/klarna/controllers/klarna');
const testOrder = require('../controller/test_data/testOrder');
const axios = require('axios');
const opn = require('opn');
require('dotenv');

const username = 'PK250364_e8c5dc522820';
const password = 'IEW5fYfsXOx9Nu32';

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

module.exports = {
    createSession,
    viewSession,
    createOrder,
    openWidget
}