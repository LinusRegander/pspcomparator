const axios = require('axios')
const endpoint = 'http://localhost:1337/api/users'

async function createUser(ctx) {
    axios.post(endpoint, ctx)
      .then(response => {
        console.log('Created User', response);
        console.log('User token', response);
      })
      .catch(error => {
        console.log('An error occurred:', error.response);
      });
}

async function findOneUser(ctx) {
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

async function findMe(token) {
    let response = await axios.get(endpoint + '/me', {
        headers: {
            Accept: '*/*',
            Authorization: `Bearer ${token}`
        }
    })
    return response.data.id
}

async function updateUser(token, id, ctx) {
    console.log(ctx)
    axios.put(endpoint + `/${id}`, {
        headers: {
            Accept: '*/*',
            Authorization: `Bearer ${token}`
        },
        data: ctx
      })
      .then(response => {
        //success message or not
        console.log('Update success', response.data);
      })
      .catch(error => {
        console.log('An error occurred:');
      });
}

module.exports = {createUser, findOneUser, findMe, updateUser}