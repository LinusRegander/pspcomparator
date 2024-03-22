const axios = require('axios');
const strapiEndpoint = 'http://localhost:1337/api/orders';
/**
 * Class for strapi order endpoints
 * OBS only used by test_main, can be removed when testing for main.js complete
 */

/**
 * Create a new strapiOrder.
 * 
 * @param {string} strapiCreds - The authentication token for authorization.
 * @param {Object} ctx - The context object containing strapiOrder details.
 * @returns The created json strapiOrder object.
 * @throws {Error} If there is an error creating the strapiOrder or the request fails.
 */
async function createOrder(strapiCreds, ctx) {
    try {
        const response = await axios.post(strapiEndpoint, {
            data: ctx,
            headers: {
                Authorization: `Bearer ${strapiCreds}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('An error occurred:', error.response);
        throw error;
    }
}

/**
 * Update an strapiOrder by its ID.
 * 
 * @param {string} strapiCreds - The authentication token for authorization.
 * @param {number} id - The ID of the strapiOrder to be updated.
 * @param {Object} ctx - The context object containing updated strapiOrder details.
 * @returns The updated json strapiOrder object.
 * @throws {Error} If there is an error updating the strapiOrder or the request fails.
 */
async function updateOrder(strapiCreds, id, ctx) {
    try {
        const response = await axios.put(strapiEndpoint + `/${id}`, {
            data: ctx,
            headers: {
                Authorization: `Bearer ${strapiCreds}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('An error occurred:', error.response);
        throw error;
    }
}

/**
 * Find a strapiOrder by its ID.
 * 
 * @param {string} strapiCreds - The authentication token for authorization.
 * @param {number} id - The ID of the strapiOrder to be retrieved.
 * @returns The json strapiOrder object corresponding to the provided ID.
 * @throws {Error} If there is an error fetching the strapiOrder or the request fails.
 */
async function findOneOrder(strapiCreds, id) {
    try {
        const response = await axios.get(strapiEndpoint + `/${id}`, {
            headers: {
                Authorization: `Bearer ${strapiCreds}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('An error occurred:', error.response);
        throw error;
    }
}

module.exports = { createOrder, updateOrder, findOneOrder};
