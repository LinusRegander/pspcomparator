const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const commands = {
    Item: {
        title: "Item Options",
        Seller: ["Create", "Find One", "Find All"],
        Buyer: ["Find One", "Find All"]
    },
    Order: {
        title: "Order Options",
        Seller: ["Find One", "Find All"],
        Buyer: ["Create", "Find One", "Find All", "Payment"]
    },
    User: {
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
            throw Error('Please provide a command type.');
        }
        
        //get options depending on role
        let options = commands[command][role];

        optionsList = await generateOptionsList(options, true);
        choice = await askUser(`${role} ${command} options:\n${optionsList}`);
    
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

async function handleCommandChoice(controller, klarnaController, command, role, loginToken) {
    while (true) {

        
        let action = await chooseCommand(command, role);
        if (action === 'Return') {
            break;
        }
        if (action === 'Payment') {
            //for testing purposes:
            let strapiOrderID = 1;
            // let strapiOrderID = await getInfo(`Select ${command} ID to pay for: `)
            await klarnaController.makeAction(command, action, strapiOrderID, loginToken)
            break;
        }

        await controller.makeAction(command, action, role, loginToken);
    }
    //if loop broken, show command menu again
    getCommandChoice(controller, klarnaController, role, loginToken)
}

async function getCommandChoice(controller, klarnaController, role, loginToken) {
    try {
        let commandType = '';

        while (true) {
            commandType = await typeMenu();

            let choice = commandType.trim();

            switch (choice) {
                case '1':
                    await handleCommandChoice(controller, klarnaController, "Item", role, loginToken);
                    break;
                case '2':
                    await handleCommandChoice(controller, klarnaController, "Order", role, loginToken)
                    break;
                case '3':
                    await handleCommandChoice(controller, klarnaController, "User", role, loginToken)
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
            loginToken = await controller.loginUser();
        }

        console.log('User authenticated and logged in.');
        let role = await controller.getRole(loginToken)
        await getCommandChoice(controller, klarnaController, role, loginToken);
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = {
    run,
    getInfo
}
