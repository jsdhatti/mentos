
var Shell = require('../lib/Shell');

module.exports = function(folder, cb){
  Shell.cmd().exec(`rm -rf ${folder}`, {silent: true}, ()=>{
    cb();
  });
};