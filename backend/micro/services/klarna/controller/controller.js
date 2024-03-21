'use strict'

const axios = require('axios');
const auth = require('../auth/auth');

require('dotenv').config({ path: '../../.env'});

class KlarnaController {
    async createSession(order, token) {
        try {
            const url = process.env.KLARNA_CREATE_SESSION_URL;
            const authHeader = await auth.createAuthorization(token);
    
            const res = await axios.post(url, order, {
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
            const url = process.env.KLARNA_VIEW_SESSION_URL;
            const authHeader = await auth.createAuthorization(token);
      
            const res = await axios.get(url + sessionId, {
                headers: {
                    ...authHeader
                }
            });
      
            return res.data;
        } catch (err) {
            console.log(err);
        }
    }
    
    async createOrder(address, token, authToken) {
        try {
            const url = process.env.KLARNA_CREATE_ORDER_URL;
            const authHeader = await auth.createAuthorization(token);
        
            const res = await axios.post(url + `${authToken}/order`, address, {
                headers: {
                    ...authHeader
                }
            });
            
            return res.data;
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new KlarnaController();