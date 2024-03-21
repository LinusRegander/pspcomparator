const crudInterface = require('../models/crud_interface');
const path = '';

require('dotenv').config({ path: path });

const endpoint = 'payments';

class PaymentType extends crudInterface {
    constructor(token) {
        super()
        this.token = token;
    }

    async createPayment(ctx) {
        super.create(ctx, endpoint, this.token);
    }

    async updatePayment(ctx, id) {
        super.update(ctx, endpoint, this.token, id);
    }

    async findOnePayment(id) {
        super.findOne(endpoint, id);
    }

    async findAllPayments() {
        super.findAll(endpoint);
    }
}

module.exports = PaymentType;