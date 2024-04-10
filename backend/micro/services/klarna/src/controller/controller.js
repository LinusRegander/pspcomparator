'use strict'

const axios = require('axios');
const auth = require('../auth/auth');
const widgetBuilder = require ('./widget_builder');

require('dotenv').config({ path: '../../.env' });

const sessionURL = process.env.KLARNA_PLAYGROUND_URL + "/payments/v1/sessions";
const orderURL = process.env.KLARNA_PLAYGROUND_URL + "/payments/v1/authorizations";

class KlarnaController {
    async startSession(order, token) {
        try {
            const authHeader = await auth.createAuthorization(token);
            
            const res = await axios.post(sessionURL, order, {
                headers: {
                    ...authHeader
                }
            })
            
            return res.data;
            
        } catch (err) {
            console.log(err);
        }
    }
    
    async viewSession(sessionId, token) {
        try {
            const authHeader = await auth.createAuthorization(token);
      
            const res = await axios.get(sessionURL + '/' + sessionId, {
                headers: {
                    ...authHeader
                }
            });
      
            return res.data;
        } catch (err) {
            console.log(err);
        }
    }
    
    async createOrder(order, token, authToken) {
        try {
            const authHeader = await auth.createAuthorization(token);
        
            const res = await axios.post(orderURL + `/${authToken}/order`, order, {
                headers: {
                    ...authHeader
                }
            });
            
            return res.data;
        } catch (err) {
            console.log(err);
        }
    }
    async createWidgetHtml(clientToken, strapiOrderID) {
        try {
            const identifier = process.env.KLARNA_USERNAME;
            const password = process.env.KLARNA_PASSWORD;
            const strapiCreds = auth.getStrapiCreds(identifier, password);
            const widgetHtml = await widgetBuilder.createHTMLPageWithToken(clientToken, strapiCreds, strapiOrderID);
            return widgetHtml;

        } catch (err) {
            console.log(err);
        }
    }

}

module.exports = new KlarnaController();