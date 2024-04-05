const strapiTestOrder = require('../test_data/strapi_test_order');
const axios = require('axios');
const interface = require('./interface2');


require('dotenv').config({path: '../../.env'});

const pluralEndpoint = {
    Item: 'items',
    Order: 'orders',
    Payment: 'payments',
    Stock: 'stocks',
    User: 'users',
    Address: 'addresses' 
}

const singularEndpoint = {
    Item: 'item',
    Order: 'order',
    Payment: 'payment',
    Stock: 'stock',
    User: 'user',
    Address: 'address' 
}

//store login token for current logged in user in a header
let userToken = null;

//create header object from user's login token
function makeHeaders(token) {
    return {
        Authorization : `Bearer ${token}`
    }
}

// const strapiServiceURL = process.env.STRAPI_SERVICE_URL;
const strapiServiceURL = 'http://localhost:3001/api/strapi';
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
        } else {
            //get structure from strapi, let user fill in each field
            let identifiers = await axios.get(`${strapiServiceURL}/structure/${type}`, {
                headers: makeHeaders(userToken)
            });

            for (const identifier of identifiers.data) {
                const value = await interface.getInfo(identifier);
                obj[identifier] = value;
            }
        }
        //call relevant create endpoint
        let result = await axios.post(`${strapiServiceURL}/create/${type}`, {
            body: obj,
            headers: makeHeaders(userToken)
        });

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
        let identifiers = await axios.get(`${strapiServiceURL}/structure/${type}`);
        for (const identifier of identifiers.data) {
            const value = await interface.getInfo(identifier);
             //TODO control input is valid somehow, from type?
            obj[identifier] = value;
        }
        //let user specify which object to update by it's id, call relevant endpoint
        let id = await interface.getInfo(`Select ${type} ID`);
        //control input is valid integer
        while (!Number.isInteger(Number.parseInt(id))) {
            console.log("Not a valid ID, please enter an integer ID");
            id = await interface.getInfo(`Select ${type} ID`);
        }
        //call update endpoint in strapi server
        let result = await axios.put(`${strapiServiceURL}/update/${type}/${id}`, {
            body: obj,
            headers: makeHeaders(userToken)
        });
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
        //TODO check user is logged in (userToken exists)
        //let user specify which object to fetch by it's id, call relevant endpoint
        let id = await interface.getInfo(`Select ${type} ID`);
        //TODO contol input is valid integer
        while (!Number.isInteger(Number.parseInt(id))) {
            console.log("Not a valid ID, please enter an integer ID");
            id = await interface.getInfo(`Select ${type} ID`);
        }
        let result = await axios.get(`${strapiServiceURL}/find/${type}/${id}`, {
            headers: makeHeaders(userToken)
        });
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
        //filter results based on type/role, alt. use '?filter[attribute]=query'
        let filter = {};
        if (type == "Order" && user.role.name == "Seller") {
            //only show orders that contains items belonging to a seller
            filter.attribute = 'order_lines][item][Seller';
            filter.query = user.id;
        }else if (type == "Order" && user.role.name == "Buyer") {
            //only show orders belonging to a buyer
            filter.attribute = 'Buyer';
            filter.query = user.id;
        }
        //call endpoint for given type
        let results = await axios.get(`${strapiServiceURL}/findall/${pluralEndpoint[type]}/${filter}`, {
            headers: {
                token: userToken
            }
        });
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
        let result = await axios.get(`${strapiServiceURL}/me`, {
            headers: {
                token: userToken
            }
        });
        console.log("me result id: ", result.data.id)
        return result.data;
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
        return data;
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
        console.log(username, " wants to log in");
        let result = await axios.post(`${strapiServiceURL}/login`, 
            {
                identifier: username,
                password: password
            }
        );
        console.log(result.data)
        userToken = result.data;
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