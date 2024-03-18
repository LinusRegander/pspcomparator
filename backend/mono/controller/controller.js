const auth = require('../model/auth');
const endpoints = require('../model/endpoints');
const interface = require('../view/interface');
require('dotenv').config();

let loginToken = null;

async function editType(type, action) {
    try {
        let data = null;
        const identifiers = await endpoints.getStructure(type);

        const obj = {};
        for (const identifier of identifiers) {
            const value = await interface.getInfo(identifier);
            obj[identifier] = value;
        }

        if (action === 'Create') {
            data = await endpoints.create(loginToken, obj, type);
        } else if (action === 'Update') {
            data = await endpoints.create(loginToken, obj, type);
        }

        return data;
    } catch (err) {
        console.log(`Error creating ${type}`);
    }
}

async function findType(type) {
    try {
        let id = await interface.getInfo(`Select ${type} ID`);
        let item = await endpoints.findOne(id, type);
        console.log(item.data);
    } catch (err) {
        console.log(err);
    }
}

async function findAllType(type) {
    try {
        let items = await endpoints.findAll(type);
        console.log(items.data);
    } catch (err) {
        console.log(err);
    }
}

async function goBack() {

}

async function makeAction(type, action) {
    try {
        if (!action) {
            throw new Error('Invalid command');
        }
        
        switch (action) {
            case 'Create':
                await editType(type, action);
                break;
            case 'Update':
                await editType(type, action);
                break;
            case 'Find One':
                await findType(type);
                break;
            case 'Find All':
                await findAllType(type);
                break;
            default:
                break;
        }
    } catch (error) {
        console.error('Error making action:', error.message);
        throw error;
    }
}

async function logoutUser() {
    try {
        console.log('User logged out.');
        return loginToken = null;
    } catch (err) {
        console.log(err);
    }
}

async function loginUser() {
    try {
        let username = await interface.getInfo('Username');
        let password = await interface.getInfo('Password');
        return await auth.getToken(username, password);
    } catch (err) {
        console.log(err);
    }
}

async function authenticate() {
    try {
        if (!loginToken) {
            loginToken = await loginUser();
        }

        if (loginToken) {
            console.log('User authenticated and logged in.');
            return true;
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    makeAction,
    logoutUser,
    authenticate
}