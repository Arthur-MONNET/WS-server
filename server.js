const WebSocket = require('ws');
const fs = require('fs');
const getAlertsData = require('./getAlertsData');
const { send } = require('process');

const wss = new WebSocket.Server({ port: 8080, host: '127.0.0.1' });

const appClients = new Set();
const beaconClients = new Set();

function sendTo(client, type, payload) {
    if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type, payload }));
    }
}

function sendToMultiple(clients, type, payload) {
    clients.forEach(client => sendTo(client, type, payload));
}

function isNewAlert(newAlert, previousAlerts) {

    // si le meilleur score est == à 0 on considère que c'est une erreur et on console.log('/!\\ ERREUR DE MICRO /!\\')
    if(newAlert.reportings.sort((a, b) => b.score - a.score)[0].score === 0) {
        console.log('/!\\ ERREUR DE MICRO /!\\')
    }


    const bestReportings = newAlert.reportings.filter(reporting => reporting.score > 0.9 && reporting.index != 0 && reporting.index != 5);
    if (bestReportings.length === 0) return false;
    const bestReporting = bestReportings.sort((a, b) => b.score - a.score)[0];
    newAlert.reporting = bestReporting.index;
    // console.log('bestReporting : ', bestReporting.score, bestReporting.category_name)

    // récupérations des alertes précédentes provenant du même beacon
    previousAlerts.forEach(alert => {
        if (alert.status === 'beacon-reconition' && alert.location === newAlert.location && bestReporting.index === alert.reporting) {
            // console.log('previousAlerts : ', new Date(alert.created_at).getTime() - new Date().getTime() - 1000 * 60 * 1, new Date(alert.created_at).getTime() > new Date().getTime() - /* 1 minute */ 1000 * 60 * 1)
        }
    })
    const previousAlertsFromSameBeacon = previousAlerts.filter(alert => alert.status === 'beacon-reconition' && alert.location === newAlert.location && bestReporting.index === alert.reporting && new Date(alert.created_at).getTime() > new Date().getTime() - 1000 * 60 * 1)
    // console.log('previousAlertsFromSameBeacon : ', previousAlertsFromSameBeacon.length)

    if (previousAlertsFromSameBeacon.length === 0) return true;
    previousAlertsFromSameBeacon.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    const previousAlertFromSameBeacon = previousAlertsFromSameBeacon[0];
    previousAlertFromSameBeacon.created_at = new Date().toISOString();
    return false;
}

wss.on('listening', () => {
    console.log(`WebSocket server is listening on: ws://${wss.options.host}:${wss.options.port}`);
});

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', message => {
        const data = JSON.parse(message);
        const target = data.target;
        const sender = data.sender;
        const payload = data.payload;
        const type = data.type;
        //console.log(`Received ${type} from ${sender} for ${target} : ${JSON.stringify(payload)}`);
        if (sender === 'app') appClients.add(ws);
        else if (sender === 'beacon') beaconClients.add(ws);

        if (target === 'app') {
            if (payload) {
                sendToMultiple(appClients, type, payload)
            }

        } else if (target === 'beacon') {
            if (payload) {
                sendToMultiple(beaconClients, type, payload)
            }
        } else {
            if (type === 'connect') {
                if (sender === 'app') getAlertsData().then((alerts) => { sendTo(ws, 'alerts', alerts) })
            }
            else if (type === 'new-alert') {
                fs.readFile('alerts.json', 'utf8', (err, data) => {
                    if (err) {
                        console.error('Error reading alerts data:', err);
                    } else {
                        try {
                            const alerts = JSON.parse(data);
                            const newAlert = payload;
                            newAlert.id = alerts.length > 0 ? alerts[alerts.length - 1].id + 1 : 1;
                            if (sender === 'app') newAlert.status = 'marker';
                            else if (sender === 'beacon') {
                                newAlert.status = 'beacon-reconition'
                                newAlert.created_at = new Date().toISOString();
                                if (isNewAlert(newAlert, alerts)) alerts.push(newAlert), console.log('New alert: ' + newAlert.reportings[0].category_name);
                            }
                            fs.writeFile('alerts.json', JSON.stringify(alerts), (err) => {
                                if (err) {
                                    console.error('Error writing alerts data:', err);
                                } else {
                                    sendToMultiple(appClients, 'alerts', alerts);
                                }
                            });
                        } catch (parseError) {
                            console.error('Error parsing alerts data:', parseError);
                        }
                    }
                });
            }
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        appClients.delete(ws);
        beaconClients.delete(ws);
    });
});