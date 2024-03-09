'use strict';
const axios = require('axios');

/*
async function createOrder(token, ctx, username, password) {
  try {
    const data = ctx.request.body;

    if (token) {
      const response = await axios.post('https://api.playground.klarna.com/ordermanagement/v1/orders', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64')
        }
      });

      return response.data
    } else {
      console.log("User is not authorized.");
    }

  } catch (error) {
    console.error('Error creating a Klarna order', error);
    throw error;
  }
}
*/

module.exports = {
  async checkout(ctx) {
    try {
      const { orderId, username, password } = ctx.params;

      const response = await axios.post(`https://api.playground.klarna.com/ordermanagement/v1/orders/${orderId}/authorize`, {
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')
        }
      });

      const checkoutUrl = response.data.redirect_url;
      const script = `<script>window.open('${checkoutUrl}', '_blank');</script>`;
      ctx.type = 'text/html';
      ctx.send(script);
      
    } catch (error) {
      console.error('Error opening the Klarna checkout:', error);
      ctx.status = 500;
      ctx.send('Internal Server Error');
    }
  }
};