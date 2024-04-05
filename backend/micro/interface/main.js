const strapiController = require('./strapi_controller');
const klarnaController = require('./klarna_controller');
const klarnaServer = require('../services/klarna/server');
const strapiServer = require('../services/strapi/server');
const interface = require('./interface2');

/**
 * Main function, starts the UI using given controllers
 */
async function main() {
    try {
      //start servers (in production will be already running)
      strapiServer.startServer(/**PORT?*/);
      klarnaServer.startServer(/**PORT?*/);
      //start interface
      await interface.run(strapiController, klarnaController);
    } catch (err) {
      console.error('Error running program', err);
    }
}

main();