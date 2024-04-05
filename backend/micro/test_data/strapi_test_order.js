
/**
 * a simple example order object, containing the minimum required data to create an order in strapi
 * OBS order_lines 1 & 2, buyer 1, address 1 (and their relations) must exist in database to work
 */
const orderData = {
    order_lines: [
        1, 2
    ],
    Buyer: 1,
    address: 1
}
const orderNumber = 4;

module.exports = {
    orderData,
    orderNumber
}