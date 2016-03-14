'use strict';

const pm2 = require('pm2');
const logger = require('../helper/logger').init();
const Shell = require('../../lib/Shell');
const colors = require('colors');
const storage = require('./localstorage');
const url = 'localhost:7030';

module.exports = function(args){
  pm2.connect(function(err) {
    if (err) {
      logger.log('error', err);
      process.exit(2);
    }

    storage.init({path: 'cli/storage'})
      .then(()=>{
        if(!storage.get('isStarted')){
          logger.log('info', `no mentos process running`.yellow);
          return pm2.disconnect();
        }else{
          pm2.restart(storage.get('processInfo').pm2pid, err => {
            if(err){
              logger.log('error', err);
            }

            Shell.cmd().exec('pm2 list');
            logger.log('info', `mentos service started at ${url}`.green);

            pm2.disconnect();
          });
        }
      });
  });
};