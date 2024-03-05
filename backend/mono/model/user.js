const axios = require('axios')
const user_endpoint = 'http://localhost:1337/api/users'

async function createUser() {

    let user_data = {
        username: 'Bob'
    }  
    const response = axios.post(user_endpoint, user_data)
    console.log(response)
}

createUser()