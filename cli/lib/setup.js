
'use strict';

var ask = require('../helper/ask');
var logger = require('../helper/logger').init();
var Shell = require('../../lib/Shell');
var colors = require('colors');
var _ = require('lodash');
const _version = 'v5.0.0';

module.exports = function(args){
  logger.log('info','setting up mentos...');
  let packages = ['node$5.0.0', 'git', 'pm2', 'mongo$3.0.3'];
  let result = checkDependencies(packages);

  if(result.missing.length){
    ask({
      prop: 'ans',
      text: `do you want to install missing packages (yes/no)? NOTE: no will exit setup`
    }).then((res)=>{
        let validYes = ['yes', 'y', 'yup', 'yep', 'yo', 'obviously', 'ok', 'hmm'];
        res = (res)? res.toLowerCase() : '';
        if(res && validYes.indexOf(res) >= 0){
          logger.log('info',`said yes`);
        }else{
          logger.log('info',`said no`);
        }
      });
  }else{
    logger.log('info',`all ok`);
  }
};

function checkDependencies(packages){
  logger.log('info','required packages: ');

  var result = {
    missing: []
  };

  _.each(packages, function(pkg, i){
    let name = pkg.split('$')[0];
    let version = pkg.split('$')[1];
    if(Shell.cmd().which(name)){
      if(version){
        let installed = Shell.cmd()
          .exec(`${name} --version`, {silent: true})
          .stdout
          .replace( /^\D+/g, '')
          .trim();
        if(installed === version){
          logger.log('info',`${i+1}. ${pkg} found`.green);
        }else{
          result.missing.push(pkg);
          logger.log('info',`${i+1}. ${pkg} not found`.red);
        }
      }else{
        logger.log('info',`${i+1}. ${pkg} found`.green);
      }
    }else{
      result.missing.push(pkg);
      logger.log('info',`${i+1}. ${pkg} not found`.red);
    }
  });

  return result;
}