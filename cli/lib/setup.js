
'use strict';

const ask = require('../helper/ask');
const logger = require('../helper/logger').init();
const Shell = require('../../lib/Shell');
const colors = require('colors');
const _ = require('lodash');
const async = require('async');
const storage = require('../lib/localstorage');

module.exports = function(pkgs, forced){
  storage.init({path: 'cli/storage'})
    .then(()=>{

      if(storage.get('isSetup') && !forced){
        logger.log('info',`Setup already completed...use "mentos setup -f" to force setup`.yellow);
        return;
      }

      if(forced){
        logger.log('info','setting up mentos again...'.yellow);
      }else{
        logger.log('info','setting up mentos...');
      }

      let result = checkDependencies(pkgs);

      if(!result.missing.length){
        logger.log('info', "all required packages are installed...");
        storage.add('isSetup', true);
        return;
      }

      ask({
        prop: 'input',
        text: `do you want to install missing packages (yes/no)? NOTE: no will exit setup`
      }).then(res => {

        let validYes = ['yes', 'y', 'yup', 'yep', 'yo', 'obviously', 'ok', 'hmm'];
        res = (res) ? res.toLowerCase() : '';

        if(res && validYes.indexOf(res) >= 0){
          install(result.missing);
        } else{
          logger.log('info', `said no`);
        }
      });

    }).catch(err => console.error(err));
};

function checkDependencies(packages){
  logger.log('info','required packages');

  let result = {
    missing: []
  };

  _.each(packages, (pkg, i) => {

    // ES6 Destructuring assignment
    let name = pkg.name.split('@')[0];
    let requiredVersion = pkg.name.split('@')[1];

    if(!Shell.cmd().which(name)){
      result.missing.push(pkg);
      logger.log('info',`${i+1}. ${pkg.name} not found`.red);
      return;
    }

    if(!requiredVersion){
      logger.log('info',`${i+1}. ${pkg.name} found`.green);
      return;
    }

    let installed = Shell.cmd()
      .exec(`${name} --version`, { silent: true })
      .stdout
      .replace( /^\D+/g, '')
      .trim();

    if(installed === requiredVersion){
      logger.log('info',`${i+1}. ${pkg.name} found`.green);
    }else{
      result.missing.push(pkg);
      logger.log('info',`${i+1}. ${pkg.name} not found`.red);
    }
  });

  return result;
}

function install(packages){
  let tasks = [];

  _.each(packages, _package => {

    (function(pkg){
      tasks.push(callback => {
        let i = pkg.install;
        logger.log('info',`installing ${pkg.name} => ${pkg.install}`.yellow);

        Shell.exec(`${i}`
          ,{ async: true, silent: true }
          ,null
          ,data => {
            logger.log('info', data);
          })
          .then(() => {

            logger.log('info', `${pkg.name} installed successfully`.bgGreen);
            return callback();
          }, err => callback(err));
      });
    })(_package);

  });

  async.series(tasks, err => {
    if(err){
      logger.log('error', "Error occured...".bgRed);
      return;
    }

    logger.log('info', 'All packages installed successfully...'.bgGreen);
    storage.add('isSetup', true);
  });
}