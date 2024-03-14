const axios = require('axios');
const endpoint = 'http://localhost:1337/api/items';
const structure = 'http://localhost:1337/api/content-type-builder/content-types/';

/**
 * Create a new item.
 * 
 * @param {string} token - The authentication token for authorization.
 * @param {Object} ctx - The context object containing item details.
 * @returns The created json item object.
 * @throws {Error} If there is an error creating the item or the request fails.
 */
async function create(token, ctx) {
    try {
        const response = await axios.post(endpoint, {
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
async function update(token, id, ctx) {
    try {
        const response = await axios.put(endpoint + `/${id}`, {
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
async function findOne(id) {
    try {
        const response = await axios.get(endpoint + `/${id}`, {
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
async function findAll() {
    try {
        const response = await axios.get(endpoint);
        return response.data;
    } catch (error) {
        console.error('An error occurred:', error.response);
        throw error;
    }
}

async function getStructure() {
    try {
        const identifiers = [];

        const res = await axios.get(structure + 'api::item.item');
        const attributes = res.data.data.schema.attributes;
    
        for (const identifier in attributes) {
            identifiers.push(identifier)
        }
    
        return identifiers;
    } catch (err) {
        console.log(err);
    }
}

module.exports = { create, update, findOne, findAll, getStructure };
