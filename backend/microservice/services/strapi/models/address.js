const crudInterface = require('../models/crud_interface');
const path = '';

require('dotenv').config({ path: path });

const endpoint = 'addresses';

class AddressType extends crudInterface {
    constructor(token) {
        super()
        this.token = token;
    }

    async createAddress(ctx) {
        super.create(ctx, endpoint, this.token);
    }

    async updateAddress(ctx, id) {
        super.update(ctx, endpoint, this.token, id);
    }

    async findOneAddress(id) {
        super.findOne(endpoint, id);
    }

    async findAllAddresses() {
        super.findAll(endpoint);
    }
}

module.exports = AddressType;