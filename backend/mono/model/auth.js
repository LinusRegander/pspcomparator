const axios = require('axios');
const endpoint = 'http://localhost:1337/api/auth/local';

/**
 * Get authentication token by providing identifier and password.
 * 
 * @param {string} id - The identifier (e.g., email, username) for authentication.
 * @param {string} pass - The password for authentication.
 * @returns The JWT authentication token.
 * @throws {Error} If there is an error fetching the token or the request fails.
 */
async function getStrapiCreds(id, pass) {
    try {
        const res = await axios.post(endpoint, {
            identifier: id,
            password: pass
        });
        return res.data.jwt;
    } catch (error) {
        console.error('Error fetching token:', error.message);
        return null;
    }
}
/**
 * Creates a base-64 string from credentials to be used as a 'Basic Authentication' token
 * @param {*} username - username linked to klarna merchant account
 * @param {*} password
 * @returns 
 */
function encodeCredentials(username, password) {
    try {
        const encodedCredentials = Buffer.from(username + ":" + password).toString('base64')
        return encodedCredentials
    } catch (error) {
        console.error('Error getting Klarna authorization', error.message);
    }
}

module.exports = { 
    getStrapiCreds,
    encodeCredentials
};
