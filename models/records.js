/** Records model
  - add/delete/get records
  - chunk (chunk_size records) loader using insertMany
*/
const generator    = require('../tools/generator').generator,
      _            = require('lodash'), // lodash chunks
      config       = require('../config/config');
      mongo        = require('../tools/initDB'); // mongodb client

let records; // MongoDB collection
// db handler on Module init
mongo((db) => {
  records = db.collection('records');
  records.count({}, (err,resp)=>{
    console.log(`Total docs in collection 'records': ${resp}`);
  })
})

// console.log(generator.newBlock(10));

const records_module = (function(){
  let arr             = [],       // flat temp array with records
      chunks          = [],       // 2D array
      chunk_size      = 10000,    // one chunk size
      limit_size      = 5000000,  // max amount of records
      insert_timeout  = 200;      // timeout (ms) between each insertMany(chunk_size records)

  let json_response = {}; // response object

  // private functions
  function add_records(cnt) {
    return new Promise(function(resolve, reject) {
      (cnt>limit_size || cnt<chunk_size)?
        reject(`U have to set 'size' between ${chunk_size} and ${limit_size}`)
        :
        resolve(cnt)
    });
  }

  // chunk resolver
  function chunkResolver(chunks) {
      console.log(`Resolving chunks...`);
      return new Promise(function(resolve) {
        let promise = Promise.resolve(); // start Promise queue
        chunks.forEach((chunk,i) => {
          promise = promise.then(async () => {
            await timeout(); // waiting befor insert next chunk
            return insertChunk(chunk,i); // resolve chunk (chunk_size) records
          });
        });
        promise.then(() => {
          console.log(`All chunks resolve`);
          resolve(true); // end Promise queue AND return Promise.resolve() to await
        });
      });
  }

  // chunk saving timeout
  function timeout() {
    return new Promise(function(resolve) {
      setTimeout(function () {
        resolve()
      }, insert_timeout );
    });
  }

  // insert one chunk of chunk_size records using BULK API insertMany
  function insertChunk(chunk,i) {
    console.log(`${config.color.yellow} chunk ${++i} ${config.color.white}[ resolved ]`);
    return new Promise(function(resolve, reject) {
      records.insertMany(chunk, function(err) {
        if(err) reject(err);
        else resolve();
      });
    });
  }

  async function load_data(cnt){
    console.log(`${config.color.cyan}Generating ${config.color.white}${cnt}${config.color.cyan} records to MongoDB collection${config.color.white}`);
    arr = generator.newBlock(cnt); // add records to arr
    chunks = _.chunk(arr, chunk_size);
    console.log(`Loading ${config.color.green}${arr.length}${config.color.white} records using ${config.color.green}${chunks.length}${config.color.white} chunks of ${config.color.green}${chunk_size}${config.color.white} records`);
    arr = null; // clear array data from memory
    await chunkResolver(chunks)
    chunks = null; // clear array data from memory
    console.log(`[ ${config.color.green}Done${config.color.white} ]`)
  }


  let queryoptions = (p, s) => {
    let page = (isNaN(p)) ? 1 : Number (p).toFixed(); // default page = 1
    let size = (isNaN(s)) ? 20 : Number (s).toFixed(); // default size = 20 (if size 'undefined')
    page = (page >= 1) ? page : 1;
    size = (size >= 10) ? size : 10;
    let options = {
      limit: parseInt(size),
      skip: (page*size)-size,
      page: page
    }
      return options;
  }

  function get_records(pg,sort) {
    return new Promise(function(resolve, reject) {
      records.count({}, (error, response)=>{
        if(error) reject(error);
        else {
          if(response>0) {
            let pages = Math.ceil(response / 50);
            let options = queryoptions(pg, 50, sort);
            records.find({})
              .limit(options.limit)
              .skip(options.skip)
              .sort(sort)
              .toArray((err,docs) =>{
                json_response = {
                  pages: pages,
                  records_cnt: response,
                  records: docs,
                  page: options.page,
                  limit: options.limit
                }
                // console.log(json_response);
                resolve(json_response)
              })
          } else {
            resolve(response) // 0 records
          }
        }
      })
    });
  }

  // public interfaces
  return {
    add:  cnt  => add_records(cnt),
    load: cnt  => load_data(cnt),
    del:  ()   => records.drop(),
    get:  (page,sort)   => get_records(page,sort)
  }
})();


module.exports = {
  add:   records_module.add,
  load:  records_module.load,
  get:   records_module.get,
  del:   records_module.del
};
