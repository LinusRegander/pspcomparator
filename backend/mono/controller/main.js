const controller = require('../controller/controller');
const klarnaController = require('../controller/klarna_controller')
const interface = require('../view/interface');

async function main() {
    try {
      await interface.run(controller, klarnaController);
    } catch (err) {
      console.error('Error running program', err);
    }
}

main();