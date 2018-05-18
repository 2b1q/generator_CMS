var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    cluster = require('cluster'), // access to cluster.worker.id
    bodyParser = require('body-parser'),
    config       = require('./config/config');

// init express framework
var app = express();

/**
* Common express env setup
*/
// view engine setup
app.set('views', path.join(__dirname, 'views'))
   .set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
   .use(bodyParser.json())
   .use(bodyParser.urlencoded({ extended: false }))
   .use(cookieParser())
   .use(express.static(path.join(__dirname, 'public')));

var index = require('./routes/index'),
    rest = require('./routes/rest');
app.use('/', index)
   .use('/api', rest);

 // Last ROUTE catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
 res.locals.success = req.flash('success');
 // set locals, only providing error in development
 res.locals.message = err.message;
 res.locals.error = req.app.get('env') === 'development' ? err : {};
 // render the error page
 res.status(err.status || 500);
 res.render('error')
});

 /**
 * Setup Node server
 */

 //var debug = require('debug')('es:server');
 var http = require('http'),
    debug = require('debug')('pugbootstrap-seed:server');

// Normalize a port into a number, string, or false
var port = (val => {
 var port = parseInt(val, 10);
 if (port >= 0)   return port; // port number
 if (isNaN(port)) return val; // named pipe
 return false;
})(process.env.PORT || config.server.port); // Get port from environment
// set server port
app.set('port', config.server.ip+':'+port);
// create HTTP server
var server = http.createServer(app);
// Listen on provided port, on all network interfaces.
server.listen(port);

// server event hanlers 'on.error', 'on.listening'
server.on('error', onError);
server.on('listening', onListening);

// Event listener for HTTP server "error" event.
function onError(error) {
 if (error.syscall !== 'listen') throw error;
 var bind = typeof port === 'string' ? 'Pipe ' + port: 'Port ' + port;
 // handle specific listen errors with friendly messages
 switch (error.code) {
   case 'EACCES':
     console.log(`${bind} requires elevated privileges`);
     process.exit(1);
     break;
   case 'EADDRINUSE':
     console.log(`${bind} is already in use`);
     process.exit(1);
     break;
   default:
     throw error;
 }
}

//  Event listener for HTTP server "listening" event.
function onListening() {
 var workerid = cluster.worker.id;
 var addr = server.address();
 var bind = typeof addr === 'string' ? 'pipe ' + addr: 'port ' + addr.port;
 console.log(config.color.cyan+'Worker %d '+config.color.yellow+'Listening on '+config.color.cyan+config.server.ip+' '+config.color.white+'%s',workerid, bind)
}
