const items = require('../model/item');

async function main() {
    const data = await items.getItems();
    console.log(data.data);
}

main();