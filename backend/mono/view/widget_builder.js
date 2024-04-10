const opn = require('opn');
require('dotenv').config({path: '../../.env'});
const fs = require('fs');
const orderURL = process.env.STRAPI_ORDER_URL;

/**
 * Builds a html page for displaying klarna widget
 * TODO remove localToken requirement for PUT method, create validation endpoint(POST) in API instead
 * @param {*} klarnaClientToken 
 * @param {*} strapiCreds - strapi auth token OBS not neccessary once callback endpoint in place
 * @param {*} strapiOrderNo 
 */
function createHTMLPageWithToken(klarnaClientToken, strapiCreds, strapiOrderNo) {
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title></title>
        </head>
        <body>
            <div id="klarna-payments-container"></div>
            <button id="authorize-button">Authorize Payment</button>
            <script src="https://x.klarnacdn.net/kp/lib/v1/api.js" async></script>
            <script>
                window.addEventListener('load', function () {
                    Klarna.Payments.init({
                        client_token: '${klarnaClientToken}'
                    });
                    Klarna.Payments.load(
                        {
                            container: '#klarna-payments-container'
                        },
                        {},
                        function (res) {
                            console.debug(res);
                        }
                    )
                    document.getElementById('authorize-button').addEventListener('click', function() {
                        Klarna.Payments.authorize(
                            {},
                            {}, 
                            function(res) {   
                                <!-- res.approved == true -> call endpoint to update order in strapi with res.authorization_token -->
                                console.debug(res);
                                if (res.approved === true) {
                                const postToken = async () => {
                                    const request = {
                                    method: 'PUT',
                                    headers: {
                                        Authorization: 'Bearer ${strapiCreds}',
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        data: {
                                        klarna_auth_token: res.authorization_token,
                                        Status: 'Authorized'
                                        }
                                    })
                                    };
                                    console.debug(request)
                                    const response = await fetch('${orderURL}${strapiOrderNo}', request);
                                    
                                    console.debug(response);
                                };
                                postToken();
                                }
                            }
                        );
                    });
                });
            </script>
        </body>
        </html>
    `;
  
    // Write the HTML content to a file
    fs.writeFile('../../public/klarna_widget.html', htmlContent, (err) => {
        if (err) throw err;
        console.log('HTML file created successfully');
        // Open the HTML file using opn
        opn('../../public/klarna_widget.html');
    });
  }

  module.exports = {createHTMLPageWithToken}