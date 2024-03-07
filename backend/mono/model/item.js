const axios = require('axios')
require('dotenv').config();

const endpoint = 'http://localhost:1337/api/items'

async function getItems() {
    try {
        const res = axios.get(endpoint);
        return res;
    } catch (err) {
        console.log(err);
    }
}

async function createItem(data) {
    try {
        axios.post(endpoint, data);
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    getItems,
    createItem
}