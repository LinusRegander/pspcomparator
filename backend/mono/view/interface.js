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
        options: []
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

        if ((optionType === 'Command' && choice === '7') || (optionType === 'Action' && choice === '6')) {
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


//TODO: Better error handling and comment
async function run(controller) {
    try {
        if (!controller) {
            throw Error('Error running interface. Please provide a Controller');
        }

        let auth = await controller.authenticate();

        if (!auth) {
            console.log('User must authenticate themselves');
        }

        let commandType = '';
        let typeMenu = null;
        let commandMenu = null;

        while (true) {
            typeMenu = true;
            commandType = await askUser("Choose a command type:\n1. Strapi\n2. Klarna\n3. Logout User\nEnter your choice: ");

            if (!typeMenu) {
                commandType = await askUser("Choose a command type:\n1. Strapi\n2. Klarna\n3. Logout User\nEnter your choice: ");
            }

            let choice = commandType.trim();

            switch (choice) {
                case '1':
                    while (true) {
                        let strapiCommand = await chooseCommand('Strapi', 'Command');
                        if (strapiCommand === 'Return') {
                            commandMenu = false;
                            break;
                        }

                        let strapiAction = await chooseCommand('Strapi', 'Action');
                        if (strapiAction === 'Return') {
                            continue;
                        }

                        await controller.makeAction(strapiCommand, strapiAction);
                    }
                    break;
                case '2':
                    let klarnaCommand = await chooseCommand('Klarna', 'Command');
                    let klarnaAction = await chooseCommand('Klarna', 'Action');
                    await controller.makeAction(klarnaCommand, klarnaAction);
                    break;
                case '3':
                    await controller.logoutUser();
                    console.log('User logged out.');
                    rl.close();
                    return;
                default:
                    console.log('Invalid choice.');
                    break;
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = {
    run,
    getInfo
}
