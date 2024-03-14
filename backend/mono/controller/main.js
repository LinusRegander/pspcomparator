const users = require('../model/user');
const auth = require('../model/auth');
const orders = require('../model/order');
const addresses = require('../model/address');
const klarna = require('../../src/api/klarna/controllers/klarna');
const testOrder = require('../controller/test_data/testOrder');
const endpoints = require('../model/endpoints');
const axios = require('axios');
const opn = require('opn');
const fs = require('fs');
require('dotenv').config({path: '../../.env'});

const username = process.env.KLARNA_USERNAME;
const password = process.env.KLARNA_PASSWORD;
var localToken = '12313123123';

async function login() {
    let token = await auth.getToken('thatman', 'thispassword')
    localToken = token;
    console.log('User logged in with token: ', localToken);
}

async function createSession(order, token) {
    try {
        const response = await axios.post('http://localhost:1337/api/klarna/create_session', {
            order: order,
            token: token
        });

        return response;
    } catch (error) {
      console.error('Error creating a Klarna session:', error);
    }
}

async function viewSession(sessionId, token) {
  try {
      const response = await axios.post('http://localhost:1337/api/klarna/view_session', {
        sessionId: sessionId,
        token: token
      });

      return response;
  } catch (error) {
    console.error('Error creating a Klarna session:', error);
  }
}

async function createOrder(order, token) {
  try {
      const response = await axios.post('http://localhost:1337/api/klarna/create_order', {
        order: order,
        token: token
    });

    return response;
  } catch (error) {
    console.error('Error creating a Klarna session:', error);
  }
}

async function openWidget() {
  try {
      opn('http://localhost:1337/api/klarna/open_widget');
  } catch (error) {
    console.error('Error creating a Klarna session:', error);
  }
}

function getExampleOrder() {
  const order = {
    "order_amount": 1000,
    "order_lines": [
      {
        "name": "Ikea stol",
        "quantity": 10,
        "total_amount": 1000,
        "unit_price": 100
      }
    ],
    "purchase_country": "SE",
    "purchase_currency": "SEK"
  }
  return order
}
function createHTMLPageWithToken(token) {
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

async function main() {
    
  //log in to strapi
  await login();
  console.log(localToken);
  //create order in strapi;
  let order = getExampleOrder();
  console.log(order)
  //start klarna session;
  let token = auth.getEncodedCredentials(username, password);
  console.log(token)
  let session = await createSession(order, token);
  console.log(session.data);
  //start klarna widget
  createHTMLPageWithToken(session.data.clientToken)
  // await endpoints.sendClient(session.data.clientToken, 'http://localhost:1337/api/klarna/send_token');
  // await openWidget();
  //get authToken from widget
  // await createOrder(authToken, localToken)

}

main();