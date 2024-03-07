const axios = require('axios')
const auth_endpoint = 'http://localhost:1337/api/auth/local'

async function getToken(id, pass) {

    let response = await axios.post(auth_endpoint, {
        identifier: id,
        password: pass
    })

    return response.data.jwt;
}

module.exports = {getToken}