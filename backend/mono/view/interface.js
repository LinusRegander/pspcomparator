const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
/**
 * Structure for available commands based on user roles.
 */
const commands = {
    Item: {
        Seller: ["Create", "Find One", "Find All"],
        Buyer: ["Find One", "Find All"]
    },
    Order: {
        Seller: ["Find One", "Find All", "Complete"],
        Buyer: ["Create", "Find One", "Find All", "Payment"]
    },
    User: {
        Seller: ["Me"],
        Buyer: ["Me"]
    }
};
/**
 * Retrieves user input from command line interface.
 * @param {string} info - Information to prompt the user.
 * @returns {Promise<string>} - User input.
 */
async function getInfo(info) {
    try {
        if (!info) {
            throw new Error('No info provided');
        }

        return await new Promise((resolve) => {
            rl.question(`${info}: `, (answer) => {
                resolve(answer);
            });
        });
    } catch (err) {
        console.error(`Error getting ${info}`, err);
        throw err;
    }
}

/**
 * Allows the user to choose an action based on the available options.
 * @param {string} command - Type of command.
 * @param {Object} user - User currently logged in
 * @returns {Promise<string>} - Chosen action.
 */
async function chooseAction(command, user) {
    try {
        let choice = null;
        let optionsList = null;

        if (!command) {
            throw new Error('No command type chosen.');
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
        console.error('Error creating command structure: ', err);
        throw err;
    }
}

/**
 * Prompts the user with a question and returns the answer.
 * @param {string} question - Question to ask the user.
 * @returns {Promise<string>} - User's answer.
 */
async function askUser(question) {
    try {
        if (!question) {
            throw new Error('No question provided');
        }
    
        return new Promise((resolve) => {
            rl.question(question, (answer) => {
                resolve(answer.trim());
            });
        });
    } catch (err) {
        console.error('Error creating question text: ', err);
        throw err;
    }
}

/**
 * Generates a list of options for the user.
 * @param {string[]} options - List of available options.
 * @param {boolean} includeGoBack - Whether to include a "Go Back" option. (default = 'Logout')
 * @returns {string} - Formatted list of options.
 */
function generateOptionsList(options, includeGoBack = false) {
    try {
        if (!options) {
            throw new Error('No options provided.');
        }

        let optionsList = options.map((option, index) => `${index + 1}. ${option}`);
        
        if (includeGoBack) {
            optionsList.push(`${options.length + 1}. Go Back`);
        } else {
            optionsList.push(`${options.length + 1}. Logout`);
        }

        return optionsList.join('\n') + '\nEnter your choice: ';
    } catch (err) {
        console.error('Error generating options list.', err);
        throw err;
    }
}
/**
 * Displays the command type menu and prompts the user to choose a command.
 * @param {Object} user - User currently logged in.
 * @returns {Promise<string>} - Chosen command type.
 */
async function typeMenu(user) {
    //generate options from commands object
    let options = Object.keys(commands);
    let optionsList = await generateOptionsList(options, false);
    //display to user
    console.log(`Logged in as '${user.username}' [id:${user.id}]`);
    return await askUser(`${user.role.name} Command options:\n${optionsList}`);
}
/**
 * Handles the user's choice of command and executes appropriate actions.
 * @param {Object} strapiController - Controller object for interacting with Strapi.
 * @param {Object} klarnaController - Controller object for interacting with Klarna.
 * @param {string} command - Chosen command type.
 * @param {Object} user - User currently logged in.
 * @param {Object} strapiCreds - Credentials for accessing Strapi.
 */
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
            //TODO control input is valid integer
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
 * Displays the main menu.
 * @param {Object} strapiController - Controller object for interacting with strapi.
 * @param {Object} klarnaController - Controller object for interacting with Klarna.
 * @param {Object} user - user currently logged in.
 * @param {Object} strapiCreds - Credentials for accessing Strapi.
 */
async function getCommandChoice(strapiController, klarnaController, user, strapiCreds) {
    try {
        let commandType = '';

        while (true) {
            commandType = await typeMenu(user);

            let choice = commandType.trim();

            switch (choice) {
                case '1':
                    await handleCommandChoice(strapiController, klarnaController, "Item", user, strapiCreds);
                    break;
                case '2':
                    await handleCommandChoice(strapiController, klarnaController, "Order", user, strapiCreds)
                    break;
                case '3':
                    await handleCommandChoice(strapiController, klarnaController, "User", user, strapiCreds)
                    break;
                case '4':
                    await strapiController.logoutUser();
                    rl.close();
                    return;
                default:
                    console.log('Invalid choice. Please choose an option between 1 - 4');
                    break;
            }
        }
    } catch (err) {
        console.log('Error getting choice from user', err);
        throw err;
    }
}
/**
 * Runs the application.
 * @param {Object} strapiController - Controller object for interacting with Strapi.
 * @param {Object} klarnaController - Controller object for interacting with Klarna.
 */
async function run(strapiController, klarnaController) {
    try {
        if (!strapiController || !klarnaController) {
            throw new Error('No controllers provided');
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
    } catch (err) {
        console.error('Error starting interface:', err);
        throw err;
    }
}

module.exports = {
    run,
    getInfo
}
