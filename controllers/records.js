/** records controller
  - REST API using express middleware
  - async await Promise for waiting long Ops. from model
  - user data check_module => module pattern
*/
const config        = require('../config/config'),
      recordsmodel  = require('../models/records');

// AddRecords controller
async function AddRecords(req, res) {
  if(check_module.auth(req.query.api_key, res)) {
    let size = req.body.size;
    if(!size || typeof size !== 'number') res.json({ auth: "OK", error: "unable to pass size parameter" })
    else {
      try {
        res.json({ auth: "OK", api: 'AddRecords', msg: await recordsmodel.add(size) }); // send JSON response after generating records
        recordsmodel.load(); // push data
      }catch(e){
        res.status(500)
        res.json({ auth: "OK", api: 'AddRecords', msg: e })
      }
    }
  }
}

// GetRecords controller
async function GetRecords(req, res) {
  res.json({ api: 'GetRecords' })
  // res.json(await recordsmodel.get(check_module.getid()))
}


// Delete All records controller
async function DeleteRecords(req, res) {
  if(check_module.auth(req.query.api_key, res))
    res.json({ auth: 'OK', msg: `Delete records`})
}

// check AUTH (API_KEY) module with closures
const check_module = (function() {
  // private data
  let private_id;
  // private functions
  let send_response = function(res, msg, status) {
    res.status(status);
    res.json(msg)
  };
  // check IF token exist
  let chek_token = token => config.rest.apiKeys.includes(token);
  // public interface
  return {
    auth: function(api_key, res) {
      if(!api_key) send_response(res, { err: 'unable to set "api_key" param' }, 401)
      else if(!chek_token(api_key)) send_response(res, { err: 'bad "api_key"' }, 401)
      else return true
    }
  }
})();


module.exports = {
  add:      AddRecords,     // POST   => add records to collection
  get:      GetRecords,     // GET    => get records from collection
  delete:   DeleteRecords   // DELETE => remove ALL records from collection
};
