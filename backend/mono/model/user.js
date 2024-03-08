const axios = require('axios')
const endpoint = 'http://localhost:1337/api/users'

/**
 * Create a new user.
 * 
 * @param {Object} ctx - The context object containing user details.
 * @returns The created json user object
 * @throws {Error} If there is an error creating the user or the request fails.
 */
async function createUser(ctx) {
    try {
        //on creation, just send the data non-wrapped
        const response = await axios.post(endpoint, ctx);
        console.log('Created User', response.data);
        console.log('User token', response.data.jwt);
        return response.data;
    } catch (error) {
        console.log('An error occurred:', error.response);
        throw error;
    }
}

/**
 * Update a user's information.
 * 
 * @param {string} token - The authentication token.
 * @param {number} id - The ID of the user to be updated.
 * @param {Object} ctx - The context object containing updated user details.
 * @returns The updated json user object.
 * @throws {Error} If there is an error updating the user or the request fails.
 */
async function updateUser(token, id, ctx) {
    try {
        const response = await axios.put(endpoint + `/${id}`, {
            //possibly don't wrap data?
            data: ctx,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status !== 200) {
            throw new Error('Failed to update user');
        }
        return response.data;
    } catch (error) {
        console.log('Error updating user:', error.message);
        throw error;
    }
}
/**
 * Find a user by ID.
 * 
 * @param {string} token - The authentication token for authorization.
 * @param {number} id - The ID of the user to be retrieved.
 * @returns The json user object corresponding to the provided ID.
 * @throws {Error} If there is an error finding the user or the request fails.
*/
async function findOneUser(token, id) {
    try {
        const response = await axios.get(endpoint + `/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.log('An error occurred:', error.response);
        throw error;
    }
}

/**
 * Find the current user details.
 * 
 * @param {string} token - The authentication token.
 * @throws {Error} If there is an error finding the user or the request fails.
 */
async function findMe(token) {
    try {
        const response = await axios.get(endpoint + '/me', {
            headers: {
                Accept: '*/*',
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.id;
    } catch (error) {
        console.log('An error occurred:', error.response);
        throw error;
    }
}


module.exports = {createUser, updateUser, findOneUser, findMe}