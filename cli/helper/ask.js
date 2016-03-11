
var prompt = require('prompt');

module.exports = function(params){
  return new Promise((resolve, reject)=>{
    prompt.start();

    prompt.get({
      properties: {
        [params.prop]: {
         description: params.text
        }
      }
    }, function (err, result) {
      if (err) {
        return reject(err);
      }
      return resolve(result[params.prop]);
    });

  });
}