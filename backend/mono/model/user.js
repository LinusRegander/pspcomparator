const axios = require('axios')
const user_endpoint = 'http://localhost:1337/api/users'

// async function createUser() {

//     let data = {
//         username: 'test',  
//         email: 'test@test.com',
//         password: 'Password'
//     }  
//     const response = axios.post(user_endpoint, data)
//     console.log(response)
// }

// createUser()

axios.post('http://localhost:1337/api/users', {
    username: 'test',  
    email: 'test@test.com',
    password: 'Password',
    role: 'Authenticated'
  })
  .then(response => {
    console.log('User profile', response.data.user);
    console.log('User token', response.data.jwt);
  })
  .catch(error => {
    console.log('An error occurred:', error.response);
  });

//   axios.get('http://localhost:1337/api/items', {
//     headers: {
//         Accept: '*/*'
//     }
//   })
//   .then(response => {
//     console.log(response.data)
//   })