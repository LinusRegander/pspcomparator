const axios = require('axios');
const endpoint = 'http://localhost:1337/api/auth/local';

async function getHeaders(token) {
    try {
        if (token.Authorization) {
            return token;
        } else {
            return {
                Authorization: `Bearer ${token}`
            }
        }
    } catch (err) {
        console.log(err);
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

module.exports = {
    getHeaders,
    getEncodedCredentials,
    getStrapiCreds
}