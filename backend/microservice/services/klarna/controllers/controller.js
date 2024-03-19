'use strict'

const axios = require('axios');
const auth = require('./auth');
require('dotenv').config();

async function createSession(order, token) {
    try {
        const url = process.env.KLARNA_CREATE_SESSION_URL
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

async function viewSession(sessionId, token) {
    try {
        const url = process.env.KLARNA_VIEW_SESSION_URL;
        const authHeader = await auth.createAuthorization(token);
  
        const res = await axios.get(url, {
            headers: {
                ...authHeader
            },
            params: {
                session_id: sessionId
            }
        });
  
        return res.data;
  
    } catch (err) {
        console.log(err);
    }
}

async function createOrder(address, token, authToken) {
    try {
        const url = process.env.KLARNA_CREATE_ORDER_URL;
        const authHeader = await auth.createAuthorization(token);
    
        const res = await axios.post(url, address, {
            headers: {
                ...authHeader
            },
            params: {
                authorizationToken: authToken
            }
        
        });
        
        return res.data;
  
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    createSession,
    viewSession,
    createOrder
}