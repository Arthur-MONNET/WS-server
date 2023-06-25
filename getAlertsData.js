const fs = require('fs');

function getAlertsData() {
    return new Promise((resolve, reject) => {
        fs.readFile('alerts.json', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                try {
                    const alerts = JSON.parse(data);
                    resolve(alerts);
                } catch (parseError) {
                    reject(parseError);
                }
            }
        });
    });
}

module.exports = getAlertsData;