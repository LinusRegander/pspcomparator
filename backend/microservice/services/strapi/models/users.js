const crudInterface = require('../models/crud_interface');
const path = '';

require('dotenv').config({ path: path });

const endpoint = 'users';

class UserType extends crudInterface {
    constructor(token) {
        super()
        this.token = token;
    }

    async createOrder(ctx) {
        super.create(ctx, endpoint, this.token);
    }

    async updateUser(ctx, id) {
        super.update(ctx, endpoint, this.token, id);
    }

    async findOneUser(id) {
        super.findOne(endpoint, id);
    }

    async findAllUsers() {
        super.findAll(endpoint);
    }
}

module.exports = UserType;