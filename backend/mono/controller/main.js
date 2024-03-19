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
require('dotenv').config();

const username = 'PK250364_e8c5dc522820';
const password = 'IEW5fYfsXOx9Nu32';
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

async function createOrder(order, authtoken) {
  try {
      const response = await axios.post('http://localhost:1337/api/klarna/create_order', {
        order: order,
        authToken: authtoken,
        token: auth.getEncodedCredentials(username, password)
    });

    return response.data;
  } catch (error) {
    console.error('Error creating a Klarna order:', error);
  }
}


function getExampleOrder() {
  const order = {
    "order_amount": 10000,
    "order_lines": [
      {
        "name": "Ikea stol",
        "quantity": 100,
        "total_amount": 10000,
        "unit_price": 100,
        "total_discount_amount": 0,
        "type": "physical"
      }
    ],
    "purchase_country": "SE",
    "purchase_currency": "SEK",
    "intent": "buy",
    "locale": "en-SE",
    billing_address: {
        given_name: "Alice",
        family_name: "Test",
        email: "customer@email.se",
        street_address: "Södra Blasieholmshamnen 2",
        postal_code: "11148",
        city: "Stockholm",
        phone: "+46701740615",
        country: "SE"
    },
    shipping_address: {
        given_name: "Alice",
        family_name: "Test",
        email: "customer@email.se",
        street_address: "Södra Blasieholmshamnen 2",
        postal_code: "11148",
        city: "Stockholm",
        phone: "+46701740615",
        country: "SE"
    },
    customer: {
        date_of_birth: "1941-03-21",
    },
  }
  return order
}
function createHTMLPageWithToken(clientToken, localToken) {
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
                      client_token: '${clientToken}'
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
                                    Authorization: 'Bearer ${localToken}',
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
                                const response = await fetch('http://localhost:1337/api/orders/4', request);
                                
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
  // console.log(session.data);

  //start klarna widget
  createHTMLPageWithToken(session.data.clientToken, localToken)
  let authToken = '';
  while(true) {
    await wait(5000);
    let strapiOrder = await orders.findOneOrder(localToken, 4);
    console.log("order status", strapiOrder.data.attributes.Status)
    if (strapiOrder.data.attributes.Status === "Authorized") {
      authToken = strapiOrder.data.attributes.klarna_auth_token;
      break;
    }
  }
  console.log("Order authorised")
  //get authToken from widget
  console.log("creating order")
  let orderDetails = await createOrder(order, authToken)
  console.log(orderDetails)
}
function wait(timeout) {
  return new Promise(resolve => {
      setTimeout(resolve, timeout);
  });
}
main();