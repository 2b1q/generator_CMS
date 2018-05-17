var mongoose = require('mongoose'),
    config = require('../config/config');

var initMongo = function(){
  mongoose.connect(config.store.mongo.uri, config.store.mongo.options);
  let db = mongoose.connection;

  db.on('error', err =>{
    console.error(`${config.color.red}OOOOPs! Connect to mongo Error:
      ${config.color.white}${err}
      ${config.color.cyan}You have to run MongoDB: ${config.color.green}$docker run --name mongo-generator -p 127.0.0.1:27017:27017 --rm mongo`)
    process.exit(0)
  });
  db.once('open', function() {
    console.log(`${config.color.cyan}MongoDB init() => ${config.color.green}[ OK ]${config.color.white}`)
  });
}

module.exports.BackendInit = initMongo;
