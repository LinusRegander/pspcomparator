const axios = require('axios');
require('dotenv').config({path: '../../.env'});

const strapiURL = 'http://localhost:1337/api/';
const strapiStructureURL = 'http://localhost:1337/api/content-type-builder/content-types/';

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

/**
 * Create a new item in strapi
 * 
 * @param {string} strapiCreds - The authentication token for authorization.
 * @param {Object} ctx - The context object containing item details.
 * @returns The created json item object.
 * @throws {Error} If there is an error creating the item or the request fails.
 */
async function create(strapiCreds, ctx, strapiType) {
    try {
        const res = await axios.post(strapiURL + pluralEndpoint[strapiType] + '?populate=*', {
            data: ctx,
            headers:  {
                Authorization: `Bearer ${strapiCreds}`
            }
        });
        return res.data;
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
}


/**
 * Update an item by its ID.
 * 
 * @param {string} strapiCreds - The authentication token for authorization.
 * @param {number} id - The ID of the item to be updated.
 * @param {Object} ctx - The context object containing updated item details.
 * @returns The updated json item object.
 * @throws {Error} If there is an error updating the item or the request fails.
 */
async function update(strapiCreds, id, ctx, strapiType) {
    try {
        const res = await axios.put(`${strapiURL}` + pluralEndpoint[strapiType] + `/${id}` + '?populate=*', {
            data: ctx,
            headers: {
                Authorization: `Bearer ${strapiCreds}`
            }
        });
        return res.data;
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
}

/**
 * Find an item by its ID. No authorization required
 * 
 * @param {number} id - The item ID to be retrieved.
 * @returns The json item object corresponding to the provided ID.
 * @throws {Error} If there is an error fetching the item or the request fails.
 */
async function findOne(id, strapiType, strapiCreds) {
    try {
        const res = await axios.get(`${strapiURL}` + pluralEndpoint[strapiType] + `/${id}` + '?populate=*', {
            headers: {
                Accept: '*/*',
                Authorization: `Bearer ${strapiCreds}`
            },
        });
        return res.data;
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
}

/**
 * Find all items. No authorisation required?
 * 
 * @throws {Error} If there is an error fetching the items or the request fails.
 */
async function findAll(type, strapiCreds) {
    try {
        const res = await axios.get(`${strapiURL}` + pluralEndpoint[type] + '/?populate=*');
        return res.data;
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
}

/**
 * Retrives the structure for a given strapi object
 * @param {*} strapiType 
 * @param {*} strapiCreds 
 * @returns 
 */
async function getStructure(strapiType, strapiCreds) {
    try {
        const identifiers = [];
        let contentType = singularEndpoint[strapiType];
        let res = null;

        if (strapiType === 'User') {
            res = await axios.get(strapiStructureURL + `admin::${contentType}`);
        } else {
            res = await axios.get(strapiStructureURL + `api::${contentType}.${contentType}`);
        }
        const attributes = res.data.data.schema.attributes;  
        for (const identifier in attributes) {
          identifiers.push(identifier)
        }
    
        return identifiers;
    } catch (err) {
        console.log(err);
    }
}
/**
 * Gets details about current user
 * @param {*} strapiCreds 
 * @returns 
 */
async function me(strapiCreds) {
    try {
        let res = await axios.get(strapiURL + pluralEndpoint['User'] + '/me' + '/?populate=role', {
            headers: {
                Authorization: `Bearer ${strapiCreds}`
            }
        });
        return res.data
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    create,
    update,
    findOne,
    findAll,
    getStructure,
    me
}