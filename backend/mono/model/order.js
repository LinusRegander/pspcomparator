const axios = require('axios');
const items = require('./item');
const { forEach } = require('../../config/middlewares');
const endpoint = 'http://localhost:1337/api/orders';

/**
 * Create a new strapiOrder.
 * 
 * @param {string} token - The authentication token for authorization.
 * @param {Object} ctx - The context object containing strapiOrder details.
 * @returns The created json strapiOrder object.
 * @throws {Error} If there is an error creating the strapiOrder or the request fails.
 */
async function createOrder(token, ctx) {
    try {
        const response = await axios.post(endpoint, {
            data: ctx,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('An error occurred:', error.response);
        throw error;
    }
}


/**
 * Update an strapiOrder by its ID.
 * 
 * @param {string} token - The authentication token for authorization.
 * @param {number} id - The ID of the strapiOrder to be updated.
 * @param {Object} ctx - The context object containing updated strapiOrder details.
 * @returns The updated json strapiOrder object.
 * @throws {Error} If there is an error updating the strapiOrder or the request fails.
 */
async function updateOrder(token, id, ctx) {
    try {
        const response = await axios.put(endpoint + `/${id}`, {
            data: ctx,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('An error occurred:', error.response);
        throw error;
    }
}

/**
 * Find an strapiOrder by its ID.
 * 
 * @param {string} token - The authentication token for authorization.
 * @param {number} id - The ID of the strapiOrder to be retrieved.
 * @returns The json strapiOrder object corresponding to the provided ID.
 * @throws {Error} If there is an error fetching the strapiOrder or the request fails.
 */
async function findOneOrder(token, id) {
    try {
        const response = await axios.get(endpoint + `/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('An error occurred:', error.response);
        throw error;
    }
}

function createStrapiOrderObject(orderItems, buyerID, addressID) {
    //get items
    const strapiOrder = {
      "order_items": orderItems,
      "buyer": buyerID,
      "status": "Started",
      "address": addressID
    }
    return strapiOrder
  }
  async function createKlarnaOrderObject(token, strapiOrderID) {
    //get strapiOrder object from strapi first
    let strapiOrder = await findOneOrder(token, strapiOrderID)

    //create strapiOrder lines from strapi strapiOrder items
    let order_lines = []
    for (let orderItem of strapiOrder.order_items) {
        let item = await items.findOneItem(orderItem.item)
        let unit_price = item.price
        let quantity = orderItem.quantity
        let total_amount = unit_price * quantity
        order_lines.push({
            name: item.name,
            quantity: quantity,
            unit_price: unit_price,
            total_amount: total_amount
        })
    }
    //now work out total value of strapiOrder
    let order_amount = 0
    for (let order_line of order_lines) {
        order_amount += order_line.total_amount
    }
    //finally create klarna strapiOrder with all lines
    const klarnaOrder = {
      "order_amount": order_amount,
      "order_lines": order_lines,
      "purchase_country": "SE",
      "purchase_currency": "SEK"
    }
    return klarnaOrder
  }

module.exports = { createOrder, updateOrder, findOneOrder, createStrapiOrderObject, createKlarnaOrderObject };
