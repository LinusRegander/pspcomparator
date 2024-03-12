async function fetchToken(endpoint) {
    try {
        const response = await fetch(endpoint);
        
        if (!response.ok) {
            throw new Error('Failed to fetch client token');
        }
        
        const responseData = await response.json();
        console.log(responseData);
        return responseData;

    } catch (error) {
        console.error('Error fetching client token:', error);
        return null;
    }
}

async function createCheckout() {
    window.klarnaAsyncCallback = function () {
        let clientToken = 'd1b164cd-5941-5136-8085-3b6f210bb93b';

        console.log("HEJ");
    
        Klarna.Payments.init({
          client_token: clientToken
        })
        Klarna.Payments.load(
          {
              container: '#klarna-payments-container'
          },
          {},
          function (res) {
              console.debug(res);
          }
          )
      };   
}

createCheckout();