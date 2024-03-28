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
         * Receive request to start session in klarna
         * {req.params.order} klarna order to be used when creating session
         * {req.headers} token to be used for requests to strapi server
         */
        this.app.post('/api/start_session', async (req, res) => {
            try {
                //first check poster is authorised to use //leave for testing
                // const { headers } = req.headers;
                // if (!controller.check_authorization(headers)) {
                //     throw Error;
                // }
                //now get contents
                const { order } = req.body.order;
                const { token } = req.body.token;

                //call method in controller that creates session with klarna API
                const result = await controller.createSession(order, token);
                res.json(result);
            } catch (err) {
                res.status(500).json({ error: 'Internal server error' });
                console.error(err);
            }
        });
        

        /**
         * Receive request for details of an active session in klarna
         */
        this.app.get('/api/view_session/:id', async (req, res) => {
            try {
                const { id } = req.params;
                // const { token } = req.body.token;
                let result = id;
                //call method in controller to fetch session details
                // const result = await controller.viewSession(id, token);
                res.json(result);
            } catch (err) {
                res.status(500).json({ error: 'Internal server error' });
                console.error(err);
            }
        });


        /**
         * Receive request to create order in klarna
         */
        this.app.post('/api/create_order/:authToken', async (req, res) => {
            try {
                const { order } = req.body.order;
                const { token } = req.body.token;
                const { authToken } = req.params;
        
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
            console.log(`Server is running on port ${PORT}`);
        });
    }
}

module.exports = new KlarnaServer();