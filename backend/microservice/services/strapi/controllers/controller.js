const axios = require('axios');
const auth = require('../controllers/auth');

require('dotenv').config();
const URL = process.env.STRAPI_URL;

class StrapiController {
    constructor() {
        //Switch to the URL form the .env
        //this.baseURL = process.env.BASE_URL || 'http://localhost:1337';
        this.baseURL = 'http://localhost:1337'
    }

    async create(ctx, endpoint, token) {
        try {
            const headers = await auth.getHeaders(token);
            const res = await axios.post(URL + endpoint, {ctx}, {headers});
            return res.data;
        } catch (err) {
            console.log(err);
        }
    }

    async update(ctx, endpoint, token, id) {
        try {
            const headers = await auth.getHeaders(token);
            const res = await axios.post(URL + endpoint + `/${id}`, {ctx}, {headers});
            return res.data;
        } catch (err) {
            console.log(err);
        }
    }

    async findOne(endpoint, id) {
        try {
            const res = await axios.get(URL + endpoint + `/${id}` + '/?populate=*');
            return res.data;
        } catch (err) {
            console.log(err);
        }
    }

    async findAll(endpoint) {
        try {
            const res = await axios.get(URL + endpoint + '/?populate=*');
            return res.data;
        } catch (err) {
            console.log(err);
        }
    }

    async me(endpoint, token) {
        try {
            const headers = await auth.getHeaders(token);
            let res = await axios.get(URL + endpoint + '/me' + '/?populate=role', {headers});
            return res.data
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new StrapiController();
