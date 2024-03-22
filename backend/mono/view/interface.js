

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
        Seller: ["Find One", "Find All", "Complete"],
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


async function chooseAction(command, user) {
    try {
        let choice = null;
        let optionsList = null;

        if (!command) {
            throw Error('Please provide a command type.');
        }
        
        //get options depending on role
        let options = commands[command][user.role.name];

        optionsList = await generateOptionsList(options, true);
        console.log(`Logged in as '${user.username}' [id:${user.id}]`);
        choice = await askUser(`${user.role.name} ${command} options:\n${optionsList}`);
    
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
        } else {
            optionsList.push(`${options.length + 1}. Logout`);
        }

        return optionsList.join('\n') + '\nEnter your choice: ';
    } catch (err) {
        console.log('Error generating options list.', err);
    }
}

async function typeMenu(user) {
    let options = Object.keys(commands);
    let optionsList = await generateOptionsList(options, false);
    console.log(`Logged in as '${user.username}' [id:${user.id}]`);
    return await askUser(`${user.role.name} Command options:\n${optionsList}`);
}

async function handleCommandChoice(strapiController, klarnaController, command, user, strapiCreds) {
    while (true) {
        let action = await chooseAction(command, user);
        //first check if 'return' selected
        if (action === 'Return') {
            break;
        }
        //now check for klarna-related actions
        if (action === 'Payment') {
            let strapiOrderID = await getInfo(`Select ${command} ID to pay for: `);
            await klarnaController.makeAction(command, action, strapiOrderID, strapiCreds);
            break;
        }
        if (action === 'Complete') {
            // let strapiOrderID = await getInfo(`Select ${command} ID to authorise: `)
            let strapiOrder = await strapiController.makeAction(command, 'Find One', user);
            let klarna_auth_token = strapiOrder.attributes.klarna_auth_token;
            if (!klarna_auth_token) {
                console.error("Error: No authorisation token found in Strapi order");
                break;
            }
            console.log(`Creating order with auth_token: ${klarna_auth_token}`);
            await klarnaController.makeAction(command, action, klarna_auth_token, strapiCreds);
            //TODO on confirmation that order has been created, update order Status (eg.'Finished')
            break;
        }
        //if no matching klarna action found, call strapi controller
        await strapiController.makeAction(command, action, user);
    }
    //if loop broken, show command menu again
    getCommandChoice(strapiController, klarnaController, user, strapiCreds);
}
/**
 * Main menu shown after login, switch to decide which sub-menu of actions to display to user
 * @param {*} controller 
 * @param {*} klarnaController 
 * @param {*} user 
 * @param {*} strapiCreds 
 * @returns 
 */
async function getCommandChoice(controller, klarnaController, user, strapiCreds) {
    try {
        let commandType = '';

        while (true) {
            commandType = await typeMenu(user);

            let choice = commandType.trim();

            switch (choice) {
                case '1':
                    await handleCommandChoice(controller, klarnaController, "Item", user, strapiCreds);
                    break;
                case '2':
                    await handleCommandChoice(controller, klarnaController, "Order", user, strapiCreds)
                    break;
                case '3':
                    await handleCommandChoice(controller, klarnaController, "User", user, strapiCreds)
                    break;
                case '4':
                    await controller.logoutUser();
                    rl.close();
                    return;
                default:
                    console.log('Invalid choice. Please choose an option between 1 - 4');
                    break;
            }
        }
    } catch (err) {
        console.log(err);
    }
}

//TODO: Better error handling and comment
async function run(strapiController, klarnaController) {
    try {
        if (!strapiController) {
            throw Error('Error running interface. Please provide a Controller');
        }

        let strapiCreds = await strapiController.loginUser();
        
        if (!strapiCreds) {
            console.log('User must authenticate themselves');
            strapiCreds = await strapiController.loginUser();
        }

        console.log('User authenticated and logged in.');
        //get user details for use in menus
        let user = await strapiController.me(strapiCreds);
        await getCommandChoice(strapiController, klarnaController, user, strapiCreds);
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = {
    run,
    getInfo
}
