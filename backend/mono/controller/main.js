const users = require('../model/user')
const auth = require('../model/auth')

var localToken = '12313123123';

async function login() {
    let token = await auth.getToken('thatman', 'thispassword')
    localToken = token;
    console.log('User logged in with token: ', localToken);
}

async function main() {

    await login();
    console.log(localToken)
    await users.findMe(localToken);
    await users.updateMe(localToken, {
        username: 'theotherman'
    })
    // await users.createUser({
    //     username: 'thatman',
    //     email: 'that@this.com',
    //     password: 'thispassword',
    //     role: 2
    // });

    // await users.findMe({

    // })
    // await users.findOneUser
    // await users.updateMe
}

main();