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
      "method": "POST",
      "path": "/klarna/view_session",
      "handler": "klarna.viewSession",
      "config": {
          "policies": []
      }
    }
  ]
};
