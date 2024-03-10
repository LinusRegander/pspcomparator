const axios = require('axios');
const base64 = require('base-64');

function generateToken(username, password) {
    const credentials = `${username}:${password}`;
    const encodedCredentials = base64.encode(credentials);
    return `Authorization: Basic ${encodedCredentials}`;
}
const endpoint = 'http://localhost:1337/api/auth/local';

/**
 * Get authentication token by providing identifier and password.
 * 
 * @param {string} id - The identifier (e.g., email, username) for authentication.
 * @param {string} pass - The password for authentication.
 * @returns The JWT authentication token.
 * @throws {Error} If there is an error fetching the token or the request fails.
 */
async function getToken(id, pass) {
    try {
        const response = await axios.post(endpoint, {
            identifier: id,
            password: pass
        });
        return response.data.jwt;
    } catch (error) {
        console.error('Error fetching token:', error.message);
        throw error;
    }
}

async function getEncodedCredentials(username, password) {
    try {
        const encodedCredentials = base64.encode(`${username}:${password}`);
        return encodedCredentials
    } catch (error) {
        console.error('Error getting Klarna authorization', error.message);
    }
}

module.exports = { 
    getToken,
    getEncodedCredentials
};
