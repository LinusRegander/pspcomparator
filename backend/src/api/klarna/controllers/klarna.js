'use strict';

const axios = require('axios');

require('dotenv').config();

const playgroundURL = process.env.KLARNA_PLAYGROUND_URL

module.exports = {
  async test() {
    return "Hello World";
  },
  async createOrder(ctx) {
    try {

      let token = ctx.request.body.token;
      let order = ctx.request.body.order;
      let authToken = ctx.request.body.authToken;

      const headers = {
        Authorization: `Basic ${token}`,
        'Content-Type': 'application/json',
      }
  
      const res = await axios.post(`${playgroundURL}/payments/v1/authorizations/${authToken}/order`, order, {headers});
      
      return res.data;

    } catch (error) {
      console.log('Error creating an order', error);
      throw error;
    }
  },
  async createSession(ctx) {
    try {
      let order = ctx.request.body.order;
      let token = ctx.request.body.token;

      const headers = {
        Authorization: `Basic ${token}`,
        'Content-Type': 'application/json' 
      };

      const res = await axios.post(`${playgroundURL}/payments/v1/sessions`, order, {headers});

      return {
        paymentCategoryHeaders: res.data.payment_method_categories,
        sessionId: res.data.session_id,
        clientToken: res.data.client_token
      }

    } catch (error) {
      console.log('Error creating a Klarna session in Strapi', error);
      throw error;
    }
  },
  async viewSession(ctx) {
    try {
      const sessionId = ctx.request.body.sessionId;
      const token = ctx.request.body.token;

      const headers = {
        Authorization: `Basic ${token}`,
        'Content-Type': 'application/json' 
      };

      const res = await axios.get(`${playgroundURL}/payments/v1/sessions/${sessionId}`, {headers});

      return res.data;

    } catch (error) {
      console.log('Error creating an order', error);
      throw error;
    }
  }
};