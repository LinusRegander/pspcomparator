const auth = require('../model/auth');
const interface = require('../view/interface');
const strapiEndpoints = require('../model/strapi_endpoints');
const strapiTestOrder = require('./test_data/strapi_test_order')
require('dotenv').config({path: '../../.env'});

//store login token for current logged in user
let userToken = null;

/**
 * Generic create method, fetches type structure that user can fill in using UI
 * @param {*} type //type of object to create (eg item, order...)
 * @returns strapi object thats been created
 */
async function createType(type) {
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
        let result = await strapiEndpoints.create(userToken, obj, type);
        return result.data;
    } catch (err) {
        console.error(`Error creating ${type}: `, err);
    }
}
/**
 * Generic update method, fetches type structure that user can fill in using UI
 * @param {*} type 
 * @returns strapi object thats been updated 
 */
async function updateType(type) {
    try {
        let obj = {};
        //get structure from strapi, let user fill in each field
        const identifiers = await strapiEndpoints.getStructure(type, userToken);
        for (const identifier of identifiers) {
            const value = await interface.getInfo(identifier);
            obj[identifier] = value;
        }
        //let user specify which object to update by it's id, call relevant endpoint
        let id = await interface.getInfo(`Select ${type} ID`);
        let result = await strapiEndpoints.update(userToken, id, obj, type);
        return result.data;
    } catch (err) {
        console.error(`Error updating ${type}:`, err);
    }
}
/**
 * Generic find method, fetches an object of chosen type
 * @param {*} type 
 * @returns found strapi object
 */
async function findType(type) {
    try {
        //let user specify which object to fetch by it's id, call relevant endpoint
        let id = await interface.getInfo(`Select ${type} ID`);
        let result = await strapiEndpoints.findOne(id, type, userToken);
        return result.data;
    } catch (err) {
        console.error(err);
    }
}
/**
 * Generic find method, fetches all objects of chosen type
 * @param {*} type 
 * @returns list of strapi objects
 */
async function findAllType(type, user) {
    try {
        //call endpoint for given type
        let results = await strapiEndpoints.findAll(type, userToken);
        //filter results based on type/role, alt. use '?filter[attribute]=query'
        if (type == "Orders" && user.role.name == "Seller") {
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
 * @returns 
 */
async function me() {
    try {        
        let result = await strapiEndpoints.me(userToken);
        console.log("me result id: ", result.id)
        return result;
        //role = result.role.name
        //id = result.id
        //username = result.username
    } catch (err) {
        console.error(err);
    }
}
/**
 * Switch case that chooses which method to call based on type/action chosen
 * @param {*} type 
 * @param {*} action 
 * @param {*} user
 * @returns 
 */
async function makeAction(type, action, user) {
    try {
        let data = {};
        switch (action) {
            case 'Create':
                data = await createType(type);
                break;
            case 'Update':
                data = await updateType(type);
                break;
            case 'Find One':
                data = await findType(type);
                break;
            case 'Find All':
                data = await findAllType(type, user);
                break;
            case 'Me':
                data = await me();
                break;
            default:
                break;
        }
        console.log(data);
    } catch (err) {
        console.error('Error making action, please choose a valid option:');
    }
}
/**
 * Logs out user by setting token to null
 * @returns 
 */
async function logoutUser() {
    try {
        console.log('User logged out.');
        return userToken = null;
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
        userToken = await auth.getStrapiCreds(username, password);
        return userToken;
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    makeAction,
    logoutUser,
    loginUser,
    me
}