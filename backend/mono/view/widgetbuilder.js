const opn = require('opn');
const fs = require('fs');

function createHTMLPageWithToken(token, orderID) {
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
                        client_token: '${token}'
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
                              ${orderID}
                              console.debug(res);
                            }
                        );
                    });
                });
            </script>
        </body>
        </html>
    `;
  
    // Write to file so that it can be displayed
    fs.writeFile('../../public/views/klarna_widget.html', htmlContent, (err) => {
        if (err) throw err;
        // Display html after creation
        opn('../../public/views/klarna_widget.html');
    });
  }

  module.exports = {createHTMLPageWithToken}