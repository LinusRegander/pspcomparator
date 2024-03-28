'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const controller = require('./src/controller/controller');

require('dotenv').config({ path: '../../.env'});

const PORT = process.env.KLARNA_SERVER_PORT || 3001;
/**
 * Klarna service that handles communication to klarna API
*/
class KlarnaServer {
    constructor() {
        this.app = express();
        this.app.use(bodyParser.json());
    }
    
    async startServer() {
        /**
         * Handle request to start session in klarna
         */
        this.app.post('/api/klarna/start_session', async (req, res) => {
            try {
                const { order } = req.body.order;
                const { token } = req.body.token;
                //call method in controller that creates session with klarna API
                const result = await controller.createSession(order, token);
                res.json(result);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });
        

        /**
         * Handle request for details of an active session in klarna
         */
        this.app.get('/api/klarna/view_session/:id', async (req, res) => {
            try {
                const { id } = req.params;
                const { token } = req.body.token;
                //call method in controller to fetch session details
                const result = await controller.viewSession(id, token);
                res.json(result);
            } catch (err) {
                res.status(500).json({ error: 'Internal server error' });
                console.error(err);
            }
        });


        /**
         * Receive request to create order in klarna
         */
        this.app.post('/api/klarna/create_order/:authToken', async (req, res) => {
            try {
                const { order } = req.body.order;
                const { token } = req.body.token;
                const { authToken } = req.params;
                //call method in controller to create order with klarna
                const result = await controller.createOrder(order, token, authToken);
                res.json(result);
            } catch (err) {
                res.status(500).json({ error: 'Internal server error' });
                console.error(err);
            }
        });
    
        /**
         * Start server on given port
         */
        this.app.listen(PORT, () => {
            console.log(`Klarna-service Server is running on port ${PORT}`);
        });
    }
}

module.exports = new KlarnaServer();