module.exports = {
  "routes": [
    {
      "method": "POST",
      "path": "/klarna/create_order",
      "handler": "klarna.createOrder",
      "config": {
          "policies": []
      }
    },
    {
      "method": "POST",
      "path": "/klarna/create_session",
      "handler": "klarna.createSession",
      "config": {
          "policies": []
      }
    },
    {
      "method": "GET",
      "path": "/klarna/view_session",
      "handler": "klarna.viewSession",
      "config": {
          "policies": []
      }
    },
    {
      "method": "POST",
      "path": "/klarna/checkout_order",
      "handler": "klarna.createCheckoutOrder",
      "config": {
          "policies": []
      }
    },
    {
      "method": "GET",
      "path": "/klarna/view_checkout",
      "handler": "klarna.viewCheckoutOrder",
      "config": {
          "policies": []
      }
    }
  ]
};
