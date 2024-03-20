const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const commands = {
    Items: {
        title: "Item Options",
        Seller: ["Create", "Find One", "Find All"],
        Buyer: ["Find One", "Find All"]
    },
    Orders: {
        title: "Order Options",
        Seller: ["Find One", "Find All"],
        Buyer: ["Create", "Find One", "Find All"]
    },
    Users: {
        title: "User Options",
        Seller: ["Me"],
        Buyer: ["Me"]
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


async function chooseCommand(command, role) {
    try {
        let choice = null;
        let optionsList = null;

        if (!command) {
            throw Error('Please provide a type.');
        }
        

        let options = commands[command][role];

        optionsList = await generateOptionsList(options, true);
        choice = await askUser(`Choose an action:\n${optionsList}`);
    
        let index = optionsList.split('\n').length - 1;

        if (choice === String(index)) {
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
        return await askUser("Choose a command type:\n1. Items \n2. Orders \n3. User details \n4. Logout User \nEnter your choice: ");
    } catch (err) {
        console.log(err);
    }
}

async function interfaceType(controller, command, role, loginToken) {
    while (true) {

        
        let action = await chooseCommand(command, role);
        if (action === 'Return') {
            continue;
        }

        await controller.makeAction(command, action, role, loginToken);
    }
}

async function createInterface(controller, klarnaController, role, loginToken) {
    try {
        let commandType = '';

        while (true) {
            commandType = await typeMenu();

            let choice = commandType.trim();

            switch (choice) {
                case '1':
                    await interfaceType(controller, "Items", role, loginToken);
                    break;
                case '2':
                    await interfaceType(controller, "Orders", role, loginToken)
                    break;
                case '3':
                    await interfaceType(controller, "Users", role, loginToken)
                    break;
                case '4':
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
        let role = await controller.getRole(loginToken)
        await createInterface(controller, klarnaController, role, loginToken);
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = {
    run,
    getInfo
}
