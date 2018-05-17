const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Define a schema
let Schema = mongoose.Schema;

// recordSchema
let recordSchema = new Schema({
  a:  String,
  b:  String,
  c:  String
});

module.exports = mongoose.model('recordModel', recordSchema );
