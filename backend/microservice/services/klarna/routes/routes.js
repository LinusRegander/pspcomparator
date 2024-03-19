module.exports = {
    "routes": [
        {
            "method": "POST",
            "path": "/micro/klarna/create_session",
            "handler": "klarna.createSession",
            "config": {
                "policies": []
            }
        },
        {
            "method": "GET",
            "path": "/micro/klarna/view_session",
            "handler": "klarna.viewSession",
            "config": {
                "policies": []
            }
        },
        {
            "method": "POST",
            "path": "/micro/klarna/create_order",
            "handler": "klarna.createOrder",
            "config": {
                "policies": []
            }
        }
    ]
}