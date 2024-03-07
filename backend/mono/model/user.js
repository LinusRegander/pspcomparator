const axios = require('axios')
const user_endpoint = 'http://localhost:1337/api/users'

async function createUser(ctx) {
    axios.post(user_endpoint, ctx)
      .then(response => {
        console.log('Created User', response);
        console.log('User token', response);
      })
      .catch(error => {
        console.log('An error occurred:', error.response);
      });
}

async function findOneUser(ctx) {
    axios.get(user_endpoint + `/${ctx.id}`, {
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
    axios.get(user_endpoint + '/me', {
        headers: {
            Accept: '*/*',
            Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        //success message or not
        console.log('User profile', response.data);
      })
      .catch(error => {
        console.log('An error occurred:', error.response);
      });
}

async function updateMe(token, ctx) {
    axios.put(user_endpoint + '/me', {
        headers: {
            Accept: '*/*',
            Authorization: `Bearer ${token}`
        },
        ctx
      })
      .then(response => {
        //success message or not
        console.log('Update success', response.data);
      })
      .catch(error => {
        console.log('An error occurred:', error.response);
      });
}

module.exports = {createUser, findOneUser, findMe, updateMe}