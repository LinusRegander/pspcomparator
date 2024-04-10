'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const controller = require('./src/controller/controller');

require('dotenv').config({ path: '../../.env'});

const PORT = process.env.STRAPI_SERVER_PORT || 3001;
/**
 * Strapi service that handles communication to strapi Backend
*/
  class StrapiServer {
      constructor() {
        this.app = express();
        this.app.use(bodyParser.json());
      }
      async startServer() {
        /**
         * Handle request to create an object in strapi
         */
        this.app.post('/api/strapi/create/:endpoint', async (req, res) => {
            try {
                const { ctx } = req.body;
                const { endpoint } = req.params;
                const { token } = req.headers;
                //call method in controller to create object
                const result = await controller.create(ctx, endpoint, token);
                res.json(result);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        /**
         * Handle request to update object in strapi
         */
        this.app.put('/api/strapi/update/:endpoint/:id', async (req, res) => {
            try {
                const { ctx } = req.body;
                const { endpoint, id } = req.params;
                const { token } = req.headers;
                //call method in controller to update object
                const result = await controller.update(ctx, endpoint, id, token);
                res.json(result);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        /**
         * Handle request to get an object's details from strapi
         */
        this.app.get('/api/strapi/find/:endpoint/:id', async (req, res) => {
            try {
                const { endpoint, id } = req.params;
                //call method in controller to get object details
                const result = await controller.findOne(endpoint, id);
                res.json(result);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });
        /**
         * Handle request to get a list of objects
         */
        this.app.get('/api/strapi/findall/:endpoint/:filter?', async (req, res) => {
            try {
                const { endpoint, filter = null } = req.params;
                const { token } = req.headers;
                let query = null;
                //if there's a filter present, get it's query value
                if (filter) {
                    query = req.query[filter];
                }
                //call method in controller to fetch all objects
                const result = await controller.findAll(endpoint, filter, query, token);
                res.json(result);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });
        /**
         * Handle request to get logged in user
         */
        this.app.get('/api/strapi/me', async (req, res) => {
          try {
              const { token } = req.headers;
              console.log("getting me for token", token)
              //call method in controller to fetch users details
              const result = await controller.me(token);
              res.json(result);
            } catch (err) {
              res.status(500).json({ error: err.message });
            }
        });
        /**
         * Handle reuqest to get an object's structure
         */
        this.app.get('/api/strapi/structure/:type', async (req, res) => {
          try {
                const { type } = req.params;
                //call method in controller to fetch object structure
                const result = await controller.getStructure(type);
                res.json(result);
              } catch (err) {
                res.status(500).json({ error: err.message });
              }
        });

        this.app.post('/api/strapi/login', async (req, res) => {
            try {
                const {identifier, password } = req.body;
                console.log(req.body)
                console.log("logging in: ", identifier);
                const strapiToken = await controller.login(identifier, password);
                res.json(strapiToken);
            } catch (err) {
                res.status(500).json({ error: err.message });
              }
        })

        /**
         * Start the server listening on given port
         */
        this.app.listen(PORT, () => {
            //   console.log(`Strapi-service server is running on port ${PORT}`);
        });
    }
}

module.exports = new StrapiServer();