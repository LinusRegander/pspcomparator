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

module.exports = {
    getHeaders,
    getEncodedCredentials
}