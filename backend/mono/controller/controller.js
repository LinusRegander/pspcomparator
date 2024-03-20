const item = require('../../src/api/item/controllers/item');
const auth = require('../model/auth');
const endpoints = require('../model/endpoints');
const interface = require('../view/interface');
require('dotenv').config();

let loginToken = null;

async function createType(type, loginToken) {
    try {
        let data = null;
        const identifiers = await endpoints.getStructure(type);

        const obj = {};
        for (const identifier of identifiers) {
            const value = await interface.getInfo(identifier);
            obj[identifier] = value;
        }

        data = await endpoints.create(loginToken, obj, type);
       

        return data;
    } catch (err) {
        console.log(`Error creating ${type}`);
    }
}

async function updateType(type, loginToken) {
    try {
        let data = null;
        const identifiers = await endpoints.getStructure(type, loginToken);

        const obj = {};
        for (const identifier of identifiers) {
            const value = await interface.getInfo(identifier);
            obj[identifier] = value;
        }

        let id = await interface.getInfo(`Select ${type} ID`);

        data = await endpoints.update(loginToken, id, obj, type);
        

        return data;
    } catch (err) {
        console.log(`Error creating ${type}`);
    }
}

async function findType(type, loginToken) {
    try {
        let id = await interface.getInfo(`Select ${type} ID`);
        let item = await endpoints.findOne(id, type, loginToken);
        console.log(item.data);
    } catch (err) {
        console.log(err);
    }
}

async function findAllType(type, role, loginToken) {
    try {

        //some logic here to constrain results based on role
        //eg orders only for buyerID or items that match sellerID
        
        let results = await endpoints.findAll(type, loginToken);

        if (type == "Orders" && role == "Seller") {
            for (let item of results.data) {
                let status = item.attributes.Status;
    
                if (status === ('Authorized' || 'Finished')) {
                    console.log(item);
                }
            }
        } else {
            for (let item of results.data) {
                console.log(item);
                }            
        }
    

    } catch (err) {
        console.log(err);
    }
}

async function me(loginToken) {
    try {

        //some logic here to constrain results based on role
        //eg orders only for buyerID or items that match sellerID
        
        let data = await endpoints.me(loginToken);
        console.log(data)

    } catch (err) {
        console.log(err);
    }
}

async function makeAction(type, action, role, loginToken) {
    try {
        if (!action) {
            throw new Error('Invalid command');
        }

        switch (action) {
            case 'Create':
                await createType(type, loginToken);
                break;
            case 'Update':
                await updateType(type, loginToken);
                break;
            case 'Find One':
                await findType(type, loginToken);
                break;
            case 'Find All':
                await findAllType(type, role, loginToken);
                break;
            case 'Me':
                await me(loginToken);
                break;
            default:
                break;
        }
    } catch (error) {
        console.error('Error making action:', error.message);
        throw error;
    }
}

async function getRole(loginToken) {
    try {

        const res = await endpoints.me(loginToken);
            let userRole = res.role.name;
            return userRole
    } catch (error) {
        console.error('Error fetching role:', error.message);
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
    loginUser,
    getRole
}