const MongoClient = require('mongodb').MongoClient,
      config = require('../config/config');

let db, callback;

const url = config.store.mongo.uri, // Connection URL
      dbName = config.store.mongo.db; // Database Name
      conProp = { useNewUrlParser: true };


MongoClient.connect(url, conProp, function(e, client) {
  if(e) {
    console.error(`${config.color.white}${e}

Try to start MongoDB:
  ${config.color.green}$docker run --name mongo-generator -p 127.0.0.1:27017:27017 --rm mongo`);
  } else {
    db = client.db(dbName);
    callback(db)
  }
  // client.close();
});


module.exports = cb =>  typeof db !== 'undefined'? cb(db) : callback = cb
