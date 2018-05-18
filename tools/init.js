// const //mongoose = require('mongoose'),
//       config = require('../config/config'),
//     // recordModel  = require('../models/recordModel'),
//       MongoClient = require('mongodb').MongoClient,
//       assert = require('assert');
//
// var initMongo = function(){
//   // Connection URL
//   const url = config.store.mongo.uri;
//   // Database Name
//   const dbName = config.store.mongo.db;
//   // Use connect method to connect to the server
//   MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client) {
//     if(err){
//       console.error(`${config.color.red}OOOOPs! Connect to mongo Error:
//         ${config.color.white}${err}
//         ${config.color.cyan}You have to run MongoDB: ${config.color.green}$docker run --name mongo-generator -p 127.0.0.1:27017:27017 --rm mongo`)
//         process.exit(0)
//     }
//     assert.equal(null, err);
//     console.log("Connected successfully to MongoDB server");
//     const db = client.db(dbName);
//
//     db.collection('records').count({}, function(err, result) {
//       assert.equal(null, err);
//       console.log(`Total records in MongoDB ${result}`);
//     })
//     client.close();
//   });
// }
//
//
// module.exports.BackendInit = initMongo;
