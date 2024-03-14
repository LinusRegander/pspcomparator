const axios = require('axios');
const endpoint = 'http://localhost:1337/api/payments';

/**
 * Create a new payment.
 * 
 * @param {string} token - The authentication token for authorization.
 * @param {Object} ctx - The context object containing payment details.
 * @returns The created payment object.
 * @throws {Error} If there is an error creating the payment or the request fails.
 */
async function createPayment(token, ctx) {
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
 * Update a payment by its ID.
 * 
 * @param {string} token - The authentication token for authorization.
 * @param {number} id - The ID of the payment to be updated.
 * @param {Object} ctx - The context object containing updated payment details.
 * @returns  The updated payment object.
 * @throws {Error} If there is an error updating the payment or the request fails.
 */
async function updatePayment(token, id, ctx) {
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
 * Find a payment by its ID.
 * 
 * @param {string} token - The authentication token for authorization.
 * @param {number} id - The payment ID.
 * @returns The payment object corresponding to the provided ID.
 * @throws {Error} If there is an error fetching the payment or the request fails.
 */
async function findOnePayment(token, id) {
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

function createPaymentObject(strapiOrderID) {

}

module.exports = { createPayment, updatePayment, findOnePayment, createPaymentObject };
