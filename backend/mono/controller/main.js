const strapiController = require('./strapi_controller');
const klarnaController = require('./klarna_controller');
const interface = require('../view/interface');

/**
 * Main function, starts the UI using given controllers
 */
async function main() {
    try {
      await interface.run(strapiController, klarnaController);
    } catch (err) {
      console.error('Error running program', err);
    }
}

main();