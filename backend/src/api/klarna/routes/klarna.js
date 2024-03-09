module.exports = {
  "routes": [
    {
      "method": "GET",
      "path": "/klarna/checkout",
      "handler": "klarna.checkout",
      "config": {
          "policies": []
      }
    }
  ]
};
