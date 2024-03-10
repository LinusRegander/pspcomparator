const users = require('../model/user');
const auth = require('../model/auth');
const addresses = require('../model/address');
const klarna = require('../../src/api/klarna/controllers/klarna');
const axios = require('axios');
require('dotenv').config();

const username = process.env.KLARNA_USERNAME;
const password = process.env.KLARNA_PASSWORD;
var localToken = '12313123123';

async function login() {
    let token = await auth.getToken('thatman', 'thispassword')
    localToken = token;
    console.log('User logged in with token: ', localToken);
}

async function createSession(credentials) {
    try {
        const response = await axios.post('http://localhost:1337/api/klarna/create_session', { order: "testOrder" }, { headers: { 'Authorization': `Basic ${credentials}` }});
        console.log(response.data);
    } catch (error) {
      console.error('Error creating a Klarna session:', error);
    }
}
  

async function main() {
    let creds = auth.getEncodedCredentials(username, password);
    createSession(creds);

    //await login();
    //console.log(localToken)
    // let id = await users.findMe(localToken);
    
    //let address = {
       //Name: 'UPDATED'
    //}

    //await addresses.updateAddress(localToken, 24, address)
    // await users.findMe({

    // })
    // await users.findOneUser
    // await users.updateMe
}

main();