const auth = require('../model/auth');
const interface = require('../view/interface');
const strapiEndpoints = require('../model/strapi_endpoints');
const strapiTestOrder = require('./test_data/strapi_test_order')
require('dotenv').config({path: '../../.env'});

let loginToken = null;

/**
 * Generic create method, fetches type structure that user can fill in using UI
 * @param {*} type //type of object to create (eg item, order...)
 * @param {*} loginToken 
 * @returns strapi object thats been created
 */
async function createType(type, loginToken) {
    try {
        let obj = {};
        if (type === "Order") { //create example order
            obj = strapiTestOrder.orderData;
        } else { //get structure from strapi, let user fill in each field
            const identifiers = await strapiEndpoints.getStructure(type);
            for (const identifier of identifiers) {
                const value = await interface.getInfo(identifier);
                obj[identifier] = value;
            }
        }
        //call relevant create endpoint
        let result = await strapiEndpoints.create(loginToken, obj, type);
        return result.data;
    } catch (err) {
        console.error(`Error creating ${type}: `, err);
    }
}
/**
 * Generic update method, fetches type structure that user can fill in using UI
 * @param {*} type 
 * @param {*} loginToken 
 * @returns strapi object thats been updated 
 */
async function updateType(type, loginToken) {
    try {
        let obj = {};
        //get structure from strapi, let user fill in each field
        const identifiers = await strapiEndpoints.getStructure(type, loginToken);
        for (const identifier of identifiers) {
            const value = await interface.getInfo(identifier);
            obj[identifier] = value;
        }
        //let user specify which object to update by it's id, call relevant endpoint
        let id = await interface.getInfo(`Select ${type} ID`);
        let result = await strapiEndpoints.update(loginToken, id, obj, type);
        return result.data;
    } catch (err) {
        console.error(`Error updating ${type}:`, err);
    }
}
/**
 * Generic find method, fetches an object of chosen type
 * @param {*} type 
 * @param {*} loginToken 
 * @returns found strapi object
 */
async function findType(type, loginToken) {
    try {
        //let user specify which object to fetch by it's id, call relevant endpoint
        let id = await interface.getInfo(`Select ${type} ID`);
        let result = await strapiEndpoints.findOne(id, type, loginToken);
        return result.data;
    } catch (err) {
        console.error(err);
    }
}
/**
 * Generic find method, fetches all objects of chosen type
 * @param {*} type 
 * @param {*} loginToken 
 * @returns list of strapi objects
 */
async function findAllType(type, role, loginToken) {
    try {
        //call endpoint for given type
        let results = await strapiEndpoints.findAll(type, loginToken);
        //filter results based on type/role, alt. use '?filter[attribute]=query'
        if (type == "Orders" && role == "Seller") {
            //only show orders that have been authorised to a seller
            for (let item of results.data) {
                let status = item.attributes.Status;
                if (status === ('Authorized' || 'Finished')) {
                    console.log(item);
                }
            }
        }
        return results.data;
    } catch (err) {
        console.error(err);
    }
}
/**
 * Get details for the logged in user
 * @param {*} loginToken 
 * @returns 
 */
async function me(loginToken) {
    try {        
        let result = await strapiEndpoints.me(loginToken);
        console.log("me result id: ", result.id)
        return result;
        //role = result.role.name
        //id = result.id
    } catch (err) {
        console.error(err);
    }
}
/**
 * Fetches a users role
 * @param {*} loginToken 
 * @returns 
 */
async function getRole(loginToken) {
    try {
        const res = await strapiEndpoints.me(loginToken);1
        console.log("get role result: ", res.role.name)
            let userRole = res.role.name;
            return userRole;
    } catch (err) {
        console.error('Error fetching role:', err);
    }
        
}
/**
 * Switch case that chooses which method to call based on type/action chosen
 * @param {*} type 
 * @param {*} action 
 * @param {*} role 
 * @param {*} strapiCreds 
 * @returns 
 */
async function makeAction(type, action, role, strapiCreds) {
    try {
        let data = {}
        if (!action) {
            throw new Error('Invalid action');
        }
        switch (action) {
            case 'Create':
                data = await createType(type, strapiCreds);
                break;
            case 'Update':
                data = await updateType(type, strapiCreds);
                break;
            case 'Find One':
                data = await findType(type, strapiCreds);
                break;
            case 'Find All':
                data = await findAllType(type, role, strapiCreds);
                break;
            case 'Me':
                data = await me(strapiCreds);
                break;
            default:
                break;
        }
        console.log(data);
    } catch (err) {
        console.error('Error making action:', err);
    }
}
/**
 * Logs out user by setting token to null
 * @returns 
 */
async function logoutUser() {
    try {
        console.log('User logged out.');
        return loginToken = null;
    } catch (err) {
        console.error(err);
    }
}
/**
 * logs in user and returns the login token
 * @returns 
 */
async function loginUser() {
    try {
        let username = await interface.getInfo('Username');
        let password = await interface.getInfo('Password');
        loginToken = await auth.getStrapiCreds(username, password);
        return loginToken;
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    makeAction,
    logoutUser,
    loginUser,
    getRole
}