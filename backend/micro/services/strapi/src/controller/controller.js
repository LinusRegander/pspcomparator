'use strict'

const axios = require('axios');
const auth = require('../auth/auth');

require('dotenv').config({ path: '../../../../../.env' });

const strapiURL = process.env.STRAPI_URL;
const strapiStructureURL = process.env.STRAPI_CONTENT_TYPE_URL;

const singularEndpoint = {
    Item: 'item',
    Order: 'order',
    Payment: 'payment',
    Stock: 'stock',
    User: 'user',
    Address: 'address' 
}

class StrapiController {
    async create(ctx, endpoint, token) {
        try {
            const headers = await auth.getHeaders(token);
            const res = await axios.post(strapiURL + endpoint, {ctx}, {headers});
            return res.data;
        } catch (err) {
            console.log(err);
        }
    }

    async update(ctx, endpoint, id, token) {
        try {
            const headers = await auth.getHeaders(token);
            const res = await axios.post(strapiURL + endpoint + `/${id}`, {ctx}, {headers});
            return res.data;
        } catch (err) {
            console.log(err);
        }
    }

    async findOne(endpoint, id) {
        try {
            const res = await axios.get(strapiURL + endpoint + `/${id}` + '/?populate=*');
            return res.data;
        } catch (err) {
            console.log(err);
        }
    }

    async findAll(endpoint, filter, query) {
        try {
            console.log("URL: ",strapiURL);
            let filterString = '';
            if (filter && query) {
                filterString = `&filters[${filter}]=${query}`;
                console.log('filter string;', filterString);
            }
            const res = await axios.get(strapiURL + endpoint + '/?populate=*' + filterString);
            return res.data;
        } catch (err) {
            console.log(err);
        }
    }

    async me(token) {
        try {
            const headers = await auth.getHeaders(token);
            let res = await axios.get(strapiURL + 'users/me' + '/?populate=role', {headers});
            return res.data
        } catch (err) {
            console.log(err);
        }
    }

    async getStructure(type) {
        try {
            const identifiers = [];
            let contentType = singularEndpoint[type];
            let res = null;

            if (type === 'User') {
                //if getting structure for user creation
                res = await axios.get(strapiStructureURL + `admin::${contentType}`);
            } else {
                //if getting stucture for object creation
                res = await axios.get(strapiStructureURL + `api::${contentType}.${contentType}`);
            }
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
