'use strict'

const axios = require('axios');
const auth = require('../auth/auth');

require('dotenv').config({ path: '../../.env' });

const URL = process.env.STRAPI_URL;
const structure = process.env.STRAPI_CONTENT_TYPE_URL;

class StrapiController {
    async create(ctx, endpoint, token) {
        try {
            const headers = await auth.getHeaders(token);
            const res = await axios.post(URL + endpoint, {ctx}, {headers});
            return res.data;
        } catch (err) {
            console.log(err);
        }
    }

    async update(ctx, endpoint, token, id) {
        try {
            const headers = await auth.getHeaders(token);
            const res = await axios.post(URL + endpoint + `/${id}`, {ctx}, {headers});
            return res.data;
        } catch (err) {
            console.log(err);
        }
    }

    async findOne(endpoint, id) {
        try {
            const res = await axios.get(URL + endpoint + `/${id}` + '/?populate=*');
            return res.data;
        } catch (err) {
            console.log(err);
        }
    }

    async findAll(endpoint) {
        try {
            const res = await axios.get(URL + endpoint + '/?populate=*');
            return res.data;
        } catch (err) {
            console.log(err);
        }
    }

    async me(endpoint, token) {
        try {
            const headers = await auth.getHeaders(token);
            let res = await axios.get(URL + endpoint + '/me' + '/?populate=role', {headers});
            return res.data
        } catch (err) {
            console.log(err);
        }
    }

    async getStructure(type) {
        try {
            const identifiers = [];
            const typeID = {
                Item: 1,
                Order: 2
            }

            let res = null;
    
            console.log(`get structure for: ${type}`)
            
            res = await axios.get(structure + `api::${typeID[type]}`);
    
            const attributes = res.data.data.schema.attributes;
        
            for (const identifier in attributes) {
              identifiers.push(identifier)
            }
        
            return identifiers;
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new StrapiController();
