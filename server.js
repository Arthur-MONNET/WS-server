const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });


const appClients = new Set();
const baliseClients = new Set();

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', message => {
        const data = JSON.parse(message);
        const type = data.type;
        const payload = data.payload;
        if (type === 'app') {
            appClients.add(ws);
            if (payload) {
                console.log(`Received message from ${type}: ${payload}`);
                baliseClients.forEach(baliseClient => {
                    if (baliseClient.readyState === WebSocket.OPEN) {
                        baliseClient.send(payload);
                    }
                });
            }

        } else if (type === 'balise') {
            baliseClients.add(ws);
            if (payload) {
                console.log(`Received message from ${type}: ${payload}`);
                appClients.forEach(appClient => {
                    if (appClient.readyState === WebSocket.OPEN) {
                        appClient.send(payload);
                    }
                });
            }
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        appClients.delete(ws);
        baliseClients.delete(ws);
    });
});
