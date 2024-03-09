const users = require('../model/user')
const auth = require('../model/auth')
const addresses = require('../model/address')
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

async function main() {
    /*
    const res = await axios.post('http://localhost:1337/klarna/create_order', {
        token: true,
        username: "PK249082_de2b6110b30c",
        password: "SdMuKPanJ7O57GJz"
    })

    console.log(res);
    */
   
    const orderId = null;
    const response = await axios.get('http://localhost:1337/api/klarna/checkout', {
        params: { orderId, username, password}
      });

    console.log(response);

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