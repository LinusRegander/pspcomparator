const testOrder = {
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

module.exports = {
    testOrder
}