const axios = require('axios')
const endpoint = 'http://localhost:1337/api/items'

async function findOneItem(ctx) {
    axios.get(endpoint + `/${ctx.id}`, {
        headers: {
            Accept: '*/*'
        }
    })
    .then(response => {
        console.log(response.data.user)
    })
    .catch(error => {
        console.log('An error occurred:', error.response);
    });
}

module.exports = {findOneItem}