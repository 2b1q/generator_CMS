const MongoClient = require('mongodb').MongoClient,
      config = require('../config/config');

let db, callback;

const url = config.store.mongo.uri, // Connection URL
      dbName = config.store.mongo.db; // Database Name
      conProp = { useNewUrlParser: true };


MongoClient.connect(url, conProp, function(e, client) {
    if(e) {
        console.log(e)
        process.exit(0)
      }
       db = client.db(dbName);
       callback(db)
       // client.close();
  });


module.exports = function(cb){
  if(typeof db != 'undefined' ){
    cb(db)
  }else{
    callback = cb
  }
}
