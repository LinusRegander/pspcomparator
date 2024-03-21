const axios = require('axios');

async function createSession(order, token) {
    try {
        const res = await axios.post(`http://localhost:1337/api/klarna/create_session`, {
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
      const response = await axios.post('http://localhost:1337/api/klarna/create_order', {
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
      const res = await axios.post(`http://localhost:1337/api/klarna/view_${type.toLowerCase()}`, {
        sessionId: sessionId,
        token: token
      });

      return res.data;
  } catch (error) {
    console.error('Error creating a Klarna session:', error);
  }
}

module.exports = {
    createOrder,
    createSession,
    view
}