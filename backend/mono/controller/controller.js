const item = require('../../src/api/item/controllers/item');
const auth = require('../model/auth');
const endpoints = require('../model/endpoints');
const interface = require('../view/interface');
require('dotenv').config();

let loginToken = null;

async function editType(type, action, role) {
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

async function findType(type, role) {
    try {
        let id = await interface.getInfo(`Select ${type} ID`);
        let item = await endpoints.findOne(id, type);
        console.log(item.data);
    } catch (err) {
        console.log(err);
    }
}

async function findAllType(type, role) {
    try {
        if (role === 'Buyer' && type === 'Order') {
            console.log(`${role} not allowed to access this.`);
        }

        if (role === 'Seller') {
            let items = await endpoints.findAll(type);

            for (let item of items.data) {
                let status = item.attributes.Status;

                if (status === ('Authorized' || 'Finished')) {
                    console.log(item);
                }
            }
        }

    } catch (err) {
        console.log(err);
    }
}

async function makeAction(type, action, loginToken) {
    try {
        if (!action) {
            throw new Error('Invalid command');
        }
        
        const res = await endpoints.getRole(loginToken);
        let userRole = res.role.name;

        switch (action) {
            case 'Create':
                await editType(type, action, userRole);
                break;
            case 'Update':
                await editType(type, action, userRole);
                break;
            case 'Find One':
                await findType(type, userRole);
                break;
            case 'Find All':
                await findAllType(type, userRole);
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

module.exports = {
    makeAction,
    logoutUser,
    loginUser
}