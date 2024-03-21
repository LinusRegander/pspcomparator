const crudInterface = require('../models/crud_interface');
const path = '';

require('dotenv').config({ path: path });

const endpoint = 'items';

class ItemType extends crudInterface {
    constructor(token) {
        super()
        this.token = token;
    }

    async createItem(ctx) {
        super.create(ctx, endpoint, this.token);
    }

    async updateItem(ctx, id) {
        super.update(ctx, endpoint, this.token, id);
    }

    async findOneItem(id) {
        super.findOne(endpoint, id);
    }

    async findAllItems() {
        super.findAll(endpoint);
    }
}

module.exports = ItemType;