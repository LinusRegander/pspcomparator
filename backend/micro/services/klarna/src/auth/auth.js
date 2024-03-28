async function createAuthorization(token) {
    return {
        Authorization: `Basic ${token}`,
        'Content-Type': 'application/json'
    }
}

module.exports = {
    createAuthorization
}