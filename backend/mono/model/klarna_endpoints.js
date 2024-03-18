const axios = require('axios');

async function create(type, order, token) {
    try {
        const res = await axios.post(`http://localhost:1337/api/klarna/create_${type.toLowerCase()}`, {
            order: order,
            token: token
        });

        return res.data;
    } catch (error) {
      console.error('Error creating a Klarna session:', error);
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
    create,
    view
}