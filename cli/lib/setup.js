
'use strict';

var ask = require('../helper/ask');
var logger = require('../helper/logger').init();
var Shell = require('../../lib/Shell');
var colors = require('colors');
var _ = require('lodash');
var async = require('async');
var os = require('os');

module.exports = function(pkgs){
  logger.log('info','setting up mentos...');

  let result = checkDependencies(pkgs);

  if(result.missing.length){
    ask({
      prop: 'input',
      text: `do you want to install missing packages (yes/no)? NOTE: no will exit setup`
    }).then((res)=>{
        let validYes = ['yes', 'y', 'yup', 'yep', 'yo', 'obviously', 'ok', 'hmm'];
        res = (res)? res.toLowerCase() : '';
        if(res && validYes.indexOf(res) >= 0){
          install(result.missing);
        }else{
          logger.log('info',`said no`);
        }
      });
  }else{
    logger.log('info',`all ok`);
  }
};

function checkDependencies(packages){
  logger.log('info','required packages');

  var result = {
    missing: []
  };

  _.each(packages, function(pkg, i){
    let name = pkg.name.split('$')[0];
    let version = pkg.name.split('$')[1];
    if(Shell.cmd().which(name)){
      if(version){
        let installed = Shell.cmd()
          .exec(`${name} --version`, {silent: true})
          .stdout
          .replace( /^\D+/g, '')
          .trim();
        if(installed === version){
          logger.log('info',`${i+1}. ${pkg.name} found`.green);
        }else{
          result.missing.push(pkg);
          logger.log('info',`${i+1}. ${pkg.name} not found`.red);
        }
      }else{
        logger.log('info',`${i+1}. ${pkg.name} found`.green);
      }
    }else{
      result.missing.push(pkg);
      logger.log('info',`${i+1}. ${pkg.name} not found`.red);
    }
  });

  return result;
}

function install(packages){
  var tasks = [];
  _.each(packages, function(p){
    console.log(p.name);
  });
  _.each(packages, function(_package){
    (function(pkg){
      tasks.push(function(callback){
        var i = pkg.i;
        if(os.type() === 'Darwin'){
          i = i.replace('apt-get', 'brew');
        }
        logger.log('info',`installing ${pkg.name} => ${pkg.i}`.yellow);
        Shell.exec(`${i}`, {async: true, silent: true}, null, (data)=>{
          logger.log('info', data);
        }).then(()=>{
            logger.log('info', `${pkg.name} installed successfully`.bgGreen);
            return callback();
          }, (err)=>{
            return callback(err);
          });
      });
    })(_package);
  });
  async.series(tasks, (err, result)=>{
    if(err){
      logger.log('error', "Error occured...".bgRed);
    }
    logger.log('info', 'All packages installed successfully...'.bgGreen);
  });
}