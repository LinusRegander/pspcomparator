'use strict';

const axios = require('axios');
const fs = require('fs');
const path = require('path');

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

      const headers = {
        Authorization: `Basic ${token}`,
        'Content-Type': 'application/json',
      }
  
      const res = await axios.post(`${playgroundURL}/payments/v1/authorizations/${token}/order`, order, {headers});
      
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
  },
  async openWidget(ctx) {
    try {
      //Add real path
      const filepath = path.resolve(__dirname, null);
      const htmlContent = fs.readFileSync(filepath, 'utf-8');

      ctx.type = 'text/html';
      ctx.send(htmlContent);
    } catch (error) {
      console.log('Error creating an order', error);
      throw error;
    }
  },
};