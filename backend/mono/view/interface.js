const controller = require('../controller/controller');

const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const commands = {
    strapi: {
        title: "Strapi Commands",
        options: ["Item", "Address", "Order", "Payment", "Stock", "User"]
    },
    klarna: {
        title: "Klarna Commands",
        options: []
    }
};

const actionCommands = ["Create", "Update", "Find One", "Find All", "Delete"];

async function getInfo(info) {
    try {
        return await new Promise((resolve) => {
            rl.question(`${info}: `, (answer) => {
                resolve(answer);
            });
        });
    } catch (err) {
        console.log(`Error getting ${info}`, err);
    }
}

async function chooseCommand(commandType) {
    try {
        const commandOptions = commands[commandType].options;
        const commandTitle = commands[commandType].title;
        
        const choice = await askUser(`Choose a command type for ${commandTitle}:\n${generateOptionsList(commandOptions)}`);
        return commandOptions[parseInt(choice) - 1];
    } catch (err) {
        console.error('Error choosing command:', err.message);
        throw err;
    }
}

async function chooseAction() {
    try {
        const choice = await askUser(`Choose an action:\n${generateOptionsList(actionCommands)}`);
        return actionCommands[parseInt(choice) - 1];
    } catch (err) {
        console.error('Error choosing action:', err.message);
        throw err;
    }
}

async function askUser(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

function generateOptionsList(options) {
    return options.map((option, index) => `${index + 1}. ${option}`).join('\n') + '\nEnter your choice: ';
}

async function run(controller) {
    try {
        let auth = await controller.authenticate();
        console.log(auth);

        if (auth) {
            const commandType = await askUser("Choose a command type:\n1. Strapi\n2. Klarna\n3. Logout User\nEnter your choice: ");
        
            switch (commandType.trim()) {
                case '1':
                    const strapiCommand = await chooseCommand('strapi');
                    const strapiAction = await chooseAction();
                    await controller.makeAction(strapiCommand, strapiAction);
                    break;
                case '2':
                    const klarnaCommand = await chooseCommand('klarna');
                    const klarnaAction = await chooseAction();
                    await controller.makeAction(klarnaCommand, klarnaAction);
                    break;
                case '3':
                    console.log('User logged out.');
                    break;
                default:
                    console.log('Invalid choice.');
                    break;
            }

            rl.close();
        } else {
            console.log('User must authenticate themselves');
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    run,
    getInfo
}
