'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const controller = require('../controller/controller');

require('dotenv').config({ path: '../../.env'});

const PORT = process.env.KLARNA_SERVER_PORT;

class KlarnaServer {
    constructor() {
        this.app = express();
        this.app.use(bodyParser.json());
    }

    async createSession() {
        this.app.post('/api/klarna/create_order/:order', async (req, res) => {
            const { order } = req.params;
            const { token } = req.headers;

            try {
              const result = await controller.createSession(order, token);
              res.json(result);
            } catch (err) {
              console.log(err);
            }
        });
    }

    async viewSession() {
        this.app.get('/api/klarna/view_session/:id', async (req, res) => {
            const { id } = req.params;
            const { token } = req.headers;
          
            try {
              const result = await controller.viewSession(id, token);
              res.json(result);
            } catch (err) {
              console.log(err);
            }
        });
    }

    async createOrder() {
        this.app.post('/api/strapi/find/:address/:authToken', async (req, res) => {
            const { address, authToken } = req.params;
            const { token } = req.headers;
        
            try {
              const result = await controller.createOrder(address, authToken, token);
              res.json(result);
            } catch (err) {
              console.log(err);
            }
        });
    }

    async startServer() {
        this.app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
}

module.exports = new KlarnaServer();