import React, { useEffect } from 'react';
import Klarna from 'react-native-klarna-inapp-sdk';

function App() {
    useEffect(() => {
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
            // Fetch client token from your server
            const clientToken = await fetchToken('YOUR_TOKEN_ENDPOINT');

            // Initialize Klarna Web SDK
            if (clientToken) {
                window.Klarna.Payments.init({
                    client_token: clientToken
                });

                // Load Klarna Payment Widget
                window.Klarna.Payments.load(
                    {
                        container: '#klarna-payments-container'
                    },
                    {},
                    function (res) {
                        console.debug(res);
                    }
                );
            }
        }

        createCheckout();
    }, []);

    return (
        <div className="App">
            <div id="klarna-payments-container"></div>
        </div>
    );
}

export default App;