const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const commands = {
    Strapi: {
        title: "Strapi Commands",
        typeOptions: ["Item", "Address", "Order", "Payment", "Stock", "User"],
        actionOptions: ["Create", "Update", "Find One", "Find All", "Delete"]
    },
    Klarna: {
        title: "Klarna Commands",
        typeOptions: ["Session", "Order"],
        actionOptions: ["Create", "View"]
    }
};

async function getInfo(info) {
    try {
        if (!info) {
            throw Error('No info provided');
        }

        return await new Promise((resolve) => {
            rl.question(`${info}: `, (answer) => {
                resolve(answer);
            });
        });
    } catch (err) {
        console.log(`Error getting ${info}`, err);
    }
}

async function chooseCommand(type, optionType) {
    try {
        let options = null;
        let choice = null;
        let optionsList = null;

        if (!type) {
            throw Error('Please provide a type.');
        }

        if (!optionType) {
            throw Error('Please provide an option type');
        }
    
        if (optionType === 'Command') {
            options = commands[type].typeOptions;
            const title = commands[type].title;
            optionsList = await generateOptionsList(options, true);
            choice = await askUser(`Choose a command type for ${title}:\n${optionsList}`);
        }

        if (optionType === 'Action') {
            options = commands[type].actionOptions;
            optionsList = await generateOptionsList(options, true);
            choice = await askUser(`Choose an action:\n${optionsList}`);
        }

        let index = optionsList.split('\n').length - 1;

        if ((optionType === 'Command' && choice === String(index)) || (optionType === 'Action' && choice === String(index))) {
            return 'Return';
        }
    
        return options[parseInt(choice) - 1];
    } catch (err) {
        console.log('Error creating command structure.', err);
    }
}

//TODO: Better error handling and comment
async function askUser(question) {
    try {
        if (!question) {
            throw Error('No question provided');
        }
    
        return new Promise((resolve) => {
            rl.question(question, (answer) => {
                resolve(answer.trim());
            });
        });
    } catch (err) {
        console.log(err);
    }
}

//TODO: Add error handling and comment
function generateOptionsList(options, includeGoBack = false) {
    try {
        if (!options) {
            throw Error('List not generated because options are not provided.');
        }

        let optionsList = options.map((option, index) => `${index + 1}. ${option}`);
        
        if (includeGoBack) {
            optionsList.push(`${options.length + 1}. Go Back`);
        }

        return optionsList.join('\n') + '\nEnter your choice: ';
    } catch (err) {
        console.log('Error generating options list.', err);
    }
}

async function typeMenu() {
    try {
        return await askUser("Choose a command type:\n1. Strapi\n2. Klarna\n3. Logout User\nEnter your choice: ");
    } catch (err) {
        console.log(err);
    }
}

async function interfaceType(type, controller, loginToken) {
    while (true) {
        let command = await chooseCommand(type, 'Command');
        if (command === 'Return') {
            break;
        }

        let action = await chooseCommand(type, 'Action');
        if (action === 'Return') {
            continue;
        }

        await controller.makeAction(command, action, loginToken);
    }
}

async function createInterface(controller, klarnaController, loginToken) {
    try {
        let commandType = '';

        while (true) {
            commandType = await typeMenu();

            let choice = commandType.trim();

            switch (choice) {
                case '1':
                    await interfaceType('Strapi', controller, loginToken);
                    break;
                case '2':
                    await interfaceType('Klarna', klarnaController)
                    break;
                case '3':
                    await controller.logoutUser();
                    rl.close();
                    return;
                default:
                    console.log('Invalid choice.');
                    break;
            }
        }
    } catch (err) {
        console.log(err);
    }
}

//TODO: Better error handling and comment
async function run(controller, klarnaController) {
    try {
        if (!controller) {
            throw Error('Error running interface. Please provide a Controller');
        }

        let loginToken = await controller.loginUser();
        
        if (!loginToken) {
            console.log('User must authenticate themselves');
            await controller.loginUser();
        }

        console.log('User authenticated and logged in.');

        await createInterface(controller, klarnaController, loginToken);
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = {
    run,
    getInfo
}
