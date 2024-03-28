async function createAuthorization(token) {
    return {
        Authorization: `Basic ${token}`,
        'Content-Type': 'application/json'
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
    getEncodedCredentials
}