const config = {};

config.server = {
  port: '3000',
  ip: (process.env.NODE_ENV == 'PROD') ? '95.213.165.61' : '127.0.0.1'
}

// REST API options
config.rest = {
	apiKeys: [ 'B@NKEX','t0kEn' ],
}

// DataStore config
/* run mongo in docker
  1. docker pull mongo (first run)
  2. docker run --name mongo-generator -p 127.0.0.1:27017:27017 --rm mongo
*/
config.store = {
  mongo: {
    uri: 'mongodb://127.0.0.1:27017/generator',
    options: {
      // useMongoClient: true,
      autoIndex: process.env.NODE_ENV !== 'PROD', // Don't build indexes in PROD
      poolSize: 2 // количество подключений в пуле
    }
  }
}

// colorize console
config.color = {
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  black: "\x1b[30m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
  white: "\x1b[37m"
}

module.exports = config;
