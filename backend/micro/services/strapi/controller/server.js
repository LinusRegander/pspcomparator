'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const controller = require('../controller/controller');

require('dotenv').config({ path: '../../.env'});

const PORT = process.env.STRAPI_SERVER_PORT;

class StrapiServer {
    constructor() {
        this.app = express();
        this.app.use(bodyParser.json());
    }

    async create() {
        this.app.post('/api/strapi/create/:endpoint', async (req, res) => {
            const { endpoint } = req.params;
            const { token } = req.headers;
            const { ctx } = req.body;
          
            try {
              const result = await controller.create(ctx, endpoint, token);
              res.json(result);
            } catch (err) {
              res.status(500).json({ error: err.message });
            }
        });
    }

    async update() {
        this.app.put('/api/strapi/update/:endpoint/:id', async (req, res) => {
            const { endpoint, id } = req.params;
            const { token } = req.headers;
            const { ctx } = req.body;
          
            try {
              const result = await controller.update(ctx, endpoint, token, id);
              res.json(result);
            } catch (err) {
              res.status(500).json({ error: err.message });
            }
        });
    }

    async findOne() {
        this.app.get('/api/strapi/find/:endpoint/:id', async (req, res) => {
            const { endpoint, id } = req.params;
        
            try {
              const result = await controller.findOne(endpoint, id);
              res.json(result);
            } catch (err) {
              res.status(500).json({ error: err.message });
            }
        });
    }

    async findAll() {
        this.app.get('/api/strapi/findall/:endpoint', async (req, res) => {
            const { endpoint } = req.params;
          
            try {
              const result = await controller.findAll(endpoint);
              res.json(result);
            } catch (err) {
              res.status(500).json({ error: err.message });
            }
        });
    }

    async getStructure() {
        this.app.get('/api/strapi/structure/:type', async (req, res) => {
            const { type } = req.params;
          
            try {
              const result = await controller.getStructure(type);
              res.json(result);
            } catch (err) {
              res.status(500).json({ error: err.message });
            }
        });
    }

    async startServer() {
        this.app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
}

module.exports = new StrapiServer();