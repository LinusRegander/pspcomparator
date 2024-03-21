const crudInterface = require('../models/crud_interface');
const path = '';

require('dotenv').config({ path: path });

const endpoint = 'orders';

class OrderType extends crudInterface {
    constructor(token) {
        super()
        this.token = token;
    }

    async createOrder(ctx) {
        super.create(ctx, endpoint, this.token);
    }

    async updateOrder(ctx, id) {
        super.update(ctx, endpoint, this.token, id);
    }

    async findOneOrder(id) {
        super.findOne(endpoint, id);
    }

    async findAllOrders() {
        super.findAll(endpoint);
    }
}

module.exports = OrderType;