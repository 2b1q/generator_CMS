/** Records model
  - add/delete/get records
*/
const recordModel  = require('./recordModel'),
      generator    = require('../tools/generator').generator,
      config       = require('../config/config');

// console.log(generator.newBlock(10));

const records_module = (function(){
  let arr = [];
  // private functions
  function add_records(cnt) {
    if(cnt>5000000) return Promise.reject('to much records')
    arr = generator.newBlock(cnt); // add records to arr
    return Promise.resolve(cnt)
  }

  function load_data(){
    console.log(`${config.color.green}Loading ${arr.length} records to MongoDB collection${config.color.white}`);
    arr.forEach(record=>{
      let insert = new recordModel(record);
      insert.save(err=>{
        if(err) console.error(`Filed to save record: ${err}`);
      });
    })
    arr = null;
    console.log('Done!')
    recordModel.count({}, (err,cnt)=>{
      console.log(`${config.color.green}Loaded ${cnt} records${config.color.white}`);
    })
  }

  function del_records() {

  }

  function get_records() {

  }

  // public interfaces
  return {
    add: cnt  => add_records(cnt),
    load: ()  => load_data(),
    del: ()   => del_records(),
    get: ()   => get_records()
  }
})();


module.exports = {
  add:   records_module.add,
  load:  records_module.load,
  get:   records_module.get,
  del:   records_module.del
};
