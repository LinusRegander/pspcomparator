const StrapiController = require('../services/strapi/controller');

async function run() {
    let getItems = await StrapiController.findAll('items');
    console.log(getItems);
}

run()