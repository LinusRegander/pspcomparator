async function createAuthorization(token) {
    return {
        Authorization: `Basic ${token}`
    }
}

module.exports = {
    createAuthorization
}