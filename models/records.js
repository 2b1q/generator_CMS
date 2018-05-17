/** Records model
  - add/delete/get records
*/
const recordModel  = require('./recordModel'),
      generator    = require('../tools/generator').generator,
      config       = require('../config/config');

// console.log(generator.newBlock(10));

const records_module = (function(){
  // private functions
  function add_records(cnt) {

  }

  function del_records() {

  }

  function get_records() {

  }

  // public interfaces
  return {
    add: cnt  => add_records(cnt),
    del: ()   => del_records(),
    get: ()   => get_records()
  }
})();


module.exports = {
  add:   records_module.add,
  get:   records_module.get,
  del:   records_module.del
};
