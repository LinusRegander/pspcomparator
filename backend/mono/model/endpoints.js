const axios = require('axios');
const path = require('path');
require('dotenv').config();

const strapiURL = 'http://localhost:1337/api/';
const structure = 'http://localhost:1337/api/content-type-builder/content-types/';

const pluralEndpoint = {
    Items: 'items',
    Orders: 'orders',
    Payments: 'payments',
    Stocks: 'stocks',
    Users: 'users',
    Address: 'addresses' 
}

const singularEndpoint = {
    Items: 'item',
    Orders: 'order',
    Payments: 'payment',
    Stocks: 'stock',
    Users: 'user',
    Address: 'address' 
}

const contentIDs = {    
    Address: 1,
    Items: 2,
    Orders: 3,
    Payments: 5,
    Stocks: 6,
    Users: 7
}

/**
 * Create a new item.
 * 
 * @param {string} token - The authentication token for authorization.
 * @param {Object} ctx - The context object containing item details.
 * @returns The created json item object.
 * @throws {Error} If there is an error creating the item or the request fails.
 */
async function create(token, ctx, type) {
    try {
        const headers =  {
            Authorization: `Bearer ${token}`
        }
        
        const res = await axios.post(strapiURL + pluralEndpoint[type], {
            data: ctx,
            headers:  {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
}


/**
 * Update an item by its ID.
 * 
 * @param {string} token - The authentication token for authorization.
 * @param {number} id - The ID of the item to be updated.
 * @param {Object} ctx - The context object containing updated item details.
 * @returns The updated json item object.
 * @throws {Error} If there is an error updating the item or the request fails.
 */
async function update(token, id, ctx, type) {
    try {
        const res = await axios.put(`${strapiURL}` + pluralEndpoint[type] + `/${id}`, {
            data: ctx,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
}

/**
 * Find an item by its ID. No authorization required
 * 
 * @param {number} id - The item ID to be retrieved.
 * @returns The json item object corresponding to the provided ID.
 * @throws {Error} If there is an error fetching the item or the request fails.
 */
async function findOne(id, type, loginToken) {
    try {
        const res = await axios.get(`${strapiURL}` + pluralEndpoint[type] + `/${id}` + '?populate=*', {
            headers: {
                Accept: '*/*'
            },
        });
        return res.data;
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
}

/**
 * Find all items. No authorisation required
 * 
 * @throws {Error} If there is an error fetching the items or the request fails.
 */
async function findAll(type, loginTOken) {
    try {
        const res = await axios.get(`${strapiURL}` + pluralEndpoint[type] + '/?populate=*');
        return res.data;
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
}

//TODO: Add comments
async function sendClient(token, endpoint) {
    try {
        let res = await axios.post(endpoint, { token: token });
        return res;
    } catch (error) {
        console.error('Error sending client token to widget', error);
        return null;
    }
}


//TODO: Add comments
async function getStructure(type, loginToken) {
    try {
        const identifiers = [];
        let contentType = contentIDs[type];
        let res = null;

        console.log(`get structure for: ${type}`)

        if (type === 'User') {
            res = await axios.get(structure + `admin::${contentType}`);
        } else {
            res = await axios.get(structure + `api::${contentType}`);
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

async function me(token) {
    try {
        let res = await axios.get(strapiURL + pluralEndpoint['Users'] + '/me' + '/?populate=role', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return res.data
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    create,
    update,
    findOne,
    findAll,
    getStructure,
    sendClient,
    me
}