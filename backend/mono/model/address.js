const axios = require('axios')
const endpoint = 'http://localhost:1337/api/addresses'

/**
 * Creates a new address.
 * 
 * @param {string} token - The authentication token for authorization.
 * @param {Object} ctx - The context object containing address details.
 * @returns The created json address object.
 * @throws {Error} If there is an error fetching the address or the request fails.
*/
async function create(token, ctx) {
    try {
        const response = await axios.post(endpoint, {
            data: ctx,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error creating address:', error.response);
        throw error;
    }
}
/**
 * Updates an address object by its ID.
 * 
 * @param {string} token - The authentication token for authorization.
 * @param {number} id - The ID of the address to be updated.
 * @param {Object} ctx - The context object containing updated address details.
 * @returns The updated json address object.
 * @throws {Error} If there is an error updating the address or the request fails.
 */
async function update(token, id, ctx) {
    try {
        const response = await axios.put(endpoint + `/${id}`, {
            data: ctx,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error updating address:', error.response);
        throw error;
    }
}
/**
 * Finds an address object by its ID.
 * 
 * @param {string} token - The authentication token for authorization.
 * @param {number} id - The ID of the address to be retrieved.
 * @returns The json address object corresponding to the provided ID.
 * @throws {Error} If there is an error fetching the address or the request fails.
 */
async function findOne(token, id) {
    try {
        const response = await axios.get(endpoint + `/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching address:', error.response);
        throw error;
    }
}



module.exports = {create, update, findOne}