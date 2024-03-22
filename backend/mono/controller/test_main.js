const auth = require('../model/auth');
const orders = require('../model/order');
const axios = require('axios');
const opn = require('opn');
const fs = require('fs');
require('dotenv').config({path: '../../.env'});
/**
 * Class for testing the authorisation flow of creating a session in klarna, getting authorisation, and finally creating an order in klarna
 */
const username = "PK250364_e8c5dc522820";
const password = "IEW5fYfsXOx9Nu32";

var localToken = '12313123123';
/**
 * Login user to strapi and save token to global variable
 */
async function login(identifier, password) {
    let token = await auth.getStrapiCreds(identifier, password);
    localToken = token;
    console.log('User logged in with token: ', localToken);
}
/**
 * Send order object to strapi endpoint that creates a klarna session
 * @param {*} order 
 * @returns klarna session id
 */
async function createSession(order) {
    try {
        const response = await axios.post('http://localhost:1337/api/klarna/create_session', {
            order: order,
            token: auth.encodeCredentials(username, password)
        });

        return response;
    } catch (error) {
      console.error('Error creating a Klarna session:', error);
    }
}
/**
 * Send klarna authorisation token and order object to strapi endpoint that creates a klarna order
 * @param {*} order 
 * @param {*} authtoken 
 * @returns klarna order id
 */
async function createOrder(order, authtoken) {
  try {
      const response = await axios.post('http://localhost:1337/api/klarna/create_order', {
        order: order,
        authToken: authtoken,
        token: auth.encodeCredentials(username, password)
    });

    return response.data;
  } catch (error) {
    console.error('Error creating a Klarna order:', error);
  }
}
/**
 * Example klarna order, containing all fields necessary to create a klarna session and get authorisation
 * @returns 
 */
function getExampleOrder() {
  const order = {
    "order_amount": 10000,
    "order_lines": [
      {
        "name": "Ikea stol",
        "quantity": 10,
        "total_amount": 10000,
        "unit_price": 1000,
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
/**
 * Creates a html page containing the klarna payment widget, plus a callback to update the strapi order status
 * @param {*} clientToken 
 * @param {*} localToken //strapi authorisation token. Not needed if merchant_urls.authorization callback url included in order when creating session
 * @param {*} strapiOrderNo 
 */
function createHTMLPageWithToken(clientToken, localToken, strapiOrderNo) {
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
                                const response = await fetch('http://localhost:1337/api/orders/${strapiOrderNo}', request);
                                
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
  await login('thatman', 'thispassword');
  //create order;
  let order = getExampleOrder();
  //start klarna session;
  let session = await createSession(order);
  //specify strapi order number  
  const strapiOrderNo = 4;
  //start klarna widget
  createHTMLPageWithToken(session.data.clientToken, localToken, strapiOrderNo);
  //check order periodically for status = 'Authenticated'
  let authToken = '';
  while(true) {
    await wait(5000);
    let strapiOrder = await orders.findOneOrder(localToken, strapiOrderNo);
    if (strapiOrder.data.attributes.Status === "Authorized") {
      authToken = strapiOrder.data.attributes.klarna_auth_token;
      break;
    }
  }
  //use klarna auth token to create klarna order
  await createOrder(order, authToken);
}
/**
 * Simple wait function that returns after the specified time (ms)
 * @param {*} timeout 
 * @returns 
 */
function wait(timeout) {
  return new Promise(resolve => {
      setTimeout(resolve, timeout);
  });
}

main();