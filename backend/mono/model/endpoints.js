const axios = require('axios');
require('dotenv');

const strapiURL = 'http://localhost:1337/api/';

const contentTypeEndpoint = {
    Item: 'items',
    Order: 'orders',
    Payment: 'payments',
    Stock: 'stocks',
    User: 'users',
    Address: 'addresses' 
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
        const response = await axios.post(`${strapiURL}` + contentTypeEndpoint[type], {
            data: ctx,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('An error occurred:', error.response);
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
        const response = await axios.put(`${strapiURL}` + contentTypeEndpoint[type] + `/${id}`, {
            data: ctx,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('An error occurred:', error.response);
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
async function findOne(id, type) {
    try {
        const response = await axios.get(`${strapiURL}` + contentTypeEndpoint[type] + `/${id}`, {
            headers: {
                Accept: '*/*'
            }
        });
        return response.data;
    } catch (error) {
        console.error('An error occurred:', error.response);
        throw error;
    }
}

/**
 * Find all items. No authorisation required
 * 
 * @throws {Error} If there is an error fetching the items or the request fails.
 */
async function findAll(type) {
    try {
        console.log(type);
        console.log(contentTypeEndpoint);
        console.log(contentTypeEndpoint[type]);
        console.log(strapiURL);
        const response = await axios.get(`${strapiURL}` + contentTypeEndpoint[type]);
        return response.data;
    } catch (error) {
        console.error('An error occurred:', error.response);
        throw error;
    }
}

async function sendClient(token, endpoint) {
    try {
        let response = await axios.post(endpoint, { token: token });
        return response;
    } catch (error) {
        console.error('Error sending client token to widget', error);
        return null;
    }
}

module.exports = {
    create,
    update,
    findOne,
    findAll,
    sendClient
}