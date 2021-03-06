'use strict';

const pm2 = require('pm2');
const logger = require('../helper/logger').init();
const Shell = require('../../lib/Shell');
const colors = require('colors');
const storage = require('./localstorage');
const url = 'localhost:7030';
const frontendApp = 'mentos-frontend';

module.exports = function(args){
  pm2.connect(function(err) {
    if (err) {
      logger.log('error', err);
      process.exit(2);
    }

    storage.init({path: 'cli/storage'})
      .then(()=>{
        if(!storage.get('isSetup')){
          logger.log('error','mentos requied packages are missing. Run "mentos setup" to install...'.red);
          return pm2.disconnect();
        }else if(storage.get('isStarted')){
          logger.log('info','mentos already running...use "mentos restart" to start process again'.yellow);
          return pm2.disconnect();
        }else{
          logger.log('info','starting mentos...');
          pm2.start({
            name: `${frontendApp}`,
            script    : 'server.js',
            exec_mode : 'cluster'
          }, function(err, apps) {
            if(err){
              logger.log('error', err);
            }

            pm2.list(function(err, list){
              let process = list[0];

              storage.add('isStarted', true);
              storage.add('processInfo', {
                pm2pid: process.pm_id,
                name: `${frontendApp}`
              });

              Shell.cmd().exec('pm2 list');
              logger.log('info', `mentos service started at ${url}`.green);

              pm2.disconnect();
            });
          });
        }
      });
  });
};