const controller = require('../controller/controller');
const interface = require('../view/interface');

async function main() {
    try {
      await interface.run(controller);
    } catch (err) {
      console.error('Error running program', err);
    }
}

main();