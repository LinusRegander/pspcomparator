'use strict';

const axios = require('axios');
require('dotenv').config();

const playgroundURL = process.env.KLARNA_PLAYGROUND_URL

module.exports = {
  async createOrder(ctx) {
    try {
      const { order, authorizationToken } = ctx.params;
      const headers = {
        'Content-Type': 'application/json',
      }
  
      const res = await axios.post(`${playgroundURL}/payments/v1/authorizations/${authorizationToken}/order`, {order}, {headers});
      
      return res.data;

    } catch (error) {
      console.log('Error creating an order', error);
      throw error;
    }
  },
  async createSession(ctx) {
    try {
      const { order } = ctx.params;
  
      const res = await axios.post(`${playgroundURL}/payments/v1/sessions`, {order});

      return {
        paymentCategoryHeaders: res.data.payment_category_headers,
        sessionId: res.data.sessionId,
        clientToken: res.data.client_token
      }

    } catch (error) {
      console.log('Error creating a Klarna session', error);
      throw error;
    }
  },
  async viewSession(ctx) {
    try {
      const sessionId = ctx.params;

      const res = await axios.get(`${playgroundURL}/payments/v1/sessions/${sessionId}`);

      return res.data;

    } catch (error) {
      console.log('Error creating an order', error);
      throw error;
    }
  },
  async createCheckoutOrder(ctx) {
    try {
      const { order, partner } = ctx.params;

      const headers = {
        'Content-Type': 'application/json',
        'Klarna_Partner': partner,
      }

      const res = await axios.post(`${playgroundURL}/checkout/v3/orders`, {order}, {headers});

      return res.data;
      /*
      const url = res.data.redirect_url;
      const script = `<script>window.open('${url}', '_blank');</script>`;
      ctx.type = 'text/html';
      ctx.send(script);
      */
    } catch (error) {
      console.error('Error opening the Klarna checkout:', error);
      throw error;
    }
  },
  async viewCheckoutOrder(ctx) {
    try {
      const { orderId } = ctx.params;

      const res = await axios.get(`${playgroundURL}/checkout/v3/orders/${orderId}`);

      return res.data;

    } catch (error) {
      console.log('Error creating an order', error);
      throw error;
    }
  }
};