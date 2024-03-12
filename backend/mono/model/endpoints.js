const axios = require('axios');

async function sendClient(token, endpoint) {
    try {
        let response = await axios.post(endpoint, { token: token });
        return response;
    } catch (error) {
        console.error('Error sending client token to widget', error);
        return null;
    }
}

module.exports = {
    sendClient
}