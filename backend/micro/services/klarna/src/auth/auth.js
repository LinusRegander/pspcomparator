
const axios = require('axios');
require('dotenv').config({ path: '../../.env' });

const strapiServiceURL = process.env.STRAPI_SERVICE_URL;

async function createAuthorization(token) {
    return {
        Authorization: `Basic ${token}`,
        'Content-Type': 'application/json'
    }
}

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
        const res = await axios.post(strapiServiceURL + 'login', {
            identifier: id,
            password: pass
        });
        return res.data.jwt;
    } catch (error) {
        console.error('Error fetching token:', error.message);
        return null;
    }
}

function getEncodedCredentials(username, password) {
    try {
        const encodedCredentials = Buffer.from(username + ":" + password).toString('base64')
        return encodedCredentials
    } catch (error) {
        console.error('Error getting Klarna authorization', error.message);
    }
}

module.exports = {
    createAuthorization,
    getStrapiCreds,
    getEncodedCredentials
}