const cluster = require('cluster');

if(cluster.isMaster) require('./master')
else require('./worker')

// uncaughtException handler
process.on('uncaughtException', function (err) {
    console.log((new Date).toUTCString() + ' uncaughtException:', err.message);
    console.log(err.stack);
    process.exit(1);
});
