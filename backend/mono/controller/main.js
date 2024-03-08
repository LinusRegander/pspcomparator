const users = require('../model/user')
const auth = require('../model/auth')
const addresses = require('../model/address')

var localToken = '12313123123';

async function login() {
    let token = await auth.getToken('thatman', 'thispassword')
    localToken = token;
    console.log('User logged in with token: ', localToken);
}

async function main() {

    await login();
    console.log(localToken)
    // let id = await users.findMe(localToken);
    
    let address = {
        Name: 'UPDATED'
    }

    await addresses.updateAddress(localToken, 24, address)
    // await users.findMe({

    // })
    // await users.findOneUser
    // await users.updateMe
}

main();