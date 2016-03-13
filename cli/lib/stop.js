'use strict';

var pm2 = require('pm2');
var logger = require('../helper/logger').init();
var Shell = require('../../lib/Shell');
var colors = require('colors');
const url = 'localhost:7030';
var storage = require('../lib/localstorage');
const frontendApp = 'mentos-frontend';

module.exports = function(args){
  console.log('starting mentos...');
  var pm2 = require('pm2');

  pm2.connect(function(err) {
    if (err) {
      logger.log('error', err);
      process.exit(2);
    }

    storage.init({path: 'cli/storage'})
      .then(()=>{
        if(storage.get('isStarted')){
          let process = storage.get('processInfo');
          pm2.stop(process.pm2pid, (err, proc)=>{
            logger.log('info','mentos process stopped'.green);
            storage.add('isStarted', false);
            Shell.cmd().exec('pm2 list');
            pm2.disconnect();
          });
        }else{
          logger.log('info','no mentos process running'.red);
          pm2.disconnect();
        }
      });
  });
};