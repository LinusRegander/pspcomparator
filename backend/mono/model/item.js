const axios = require('axios')
require('dotenv').config();
/**
 * Class for strapi Item endpoints
 * OBS only used by test_main, can be removed when testing for main.js complete
 */
const strapiEndpoint = 'http://localhost:1337/api/items'
/**
 * Get list of items from strapi, no authorisation required
 * @returns 
 */
async function getItems() {
    try {
        const res = axios.get(strapiEndpoint);
        return res;
    } catch (err) {
        console.log(err);
    }
}
/**
 * Get info
 * @param {*} data 
 */
async function createItem(data) {
    try {
        axios.post(strapiEndpoint, data);
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    getItems,
    createItem
}