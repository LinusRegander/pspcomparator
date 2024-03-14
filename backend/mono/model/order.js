const axios = require('axios');
const endpoint = 'http://localhost:1337/api/orders';

/**
 * Create a new order.
 * 
 * @param {string} token - The authentication token for authorization.
 * @param {Object} ctx - The context object containing order details.
 * @returns The created json order object.
 * @throws {Error} If there is an error creating the order or the request fails.
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
 * Update an order by its ID.
 * 
 * @param {string} token - The authentication token for authorization.
 * @param {number} id - The ID of the order to be updated.
 * @param {Object} ctx - The context object containing updated order details.
 * @returns The updated json order object.
 * @throws {Error} If there is an error updating the order or the request fails.
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
 * Find an order by its ID.
 * 
 * @param {string} token - The authentication token for authorization.
 * @param {number} id - The ID of the order to be retrieved.
 * @returns The json order object corresponding to the provided ID.
 * @throws {Error} If there is an error fetching the order or the request fails.
 */
async function findOne(token, id) {
    try {
        const response = await axios.get(endpoint + `/${id}`, {
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

module.exports = { create, update, findOne };
