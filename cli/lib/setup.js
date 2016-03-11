
'use strict';

var ask = require('../helper/ask');
var logger = require('../helper/logger').init();
var Shell = require('../../lib/Shell');
var colors = require('colors');
const _version = 'v5.0.0';

module.exports = function(args){
  logger.log('info','setting up mentos...');
  checkAll();
  //node();
};

function checkAll(){
  logger.log('info','required packages: ');

  var notFound = false;

  // Checking node
  if(Shell.cmd().which('node')){
    var v = Shell.cmd().exec('node -v', {silent: true}).stdout.split('v')[1].split('.');
    if(v[0] === '5' && v[1] === '0' && v[2] === '0'){
      logger.log('info',`1. node ${_version} found`.green);
    }else{
      notFound = true;
      logger.log('info',`1. node ${_version} not found`.red);
    }
  }else{
    notFound = true;
    logger.log('info',`node ${_version} not found`.red);
  }

  // Checking git
  if(Shell.cmd().which('git')){
    logger.log('info',`2. git found`.green);
  }else{
    notFound = true;
    logger.log('info',`2. git not found`.red);
  }

  // Checking pm2
  if(Shell.cmd().which('pm2')){
    logger.log('info',`3. pm2 found`.green);
  }else{
    notFound = true;
    logger.log('info',`3. pm2 not found`.red);
  }

  // Checking mongodb
  if(Shell.cmd().which('mongo')){
    logger.log('info',`4. mongodb found`.green);
  }else{
    notFound = true;
    logger.log('info',`4. mongodb not found`.red);
  }

  var validYes = ['yes', 'y', 'yup', 'yep', 'yo', 'obviously', 'ok', 'hmm'];

  if(notFound){
    ask({
      prop: 'ans',
      text: `do you want to install missing packages (yes/no)? NOTE: no will exit setup`
    }).then((res)=>{
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
}

function node(){
  return new Promise((resolve, reject)=>{
    if(Shell.cmd().which('node')){
      var v = Shell.cmd().exec('node -v', {silent: true}).stdout.split('v')[1].split('.');
      if(v[0] === '5' && v[1] === '0' && v[2] === '0'){
        logger.log('info',`found node ${_version}`);
      }else{
        install()
          .then(()=>{
            logger.log('info',`node ${_version} is installed successfully`);
          }, (err)=>{
            if(err.cancelled){
              logger.log('error',`node installation cancelled`);
            }else{
              logger.log('error',`not able to install node ${_version}`);
              logger.log('error',`${err}`);
            }
          });
      }
    }else{
      install()
        .then(()=>{
          logger.log('info',`node ${_version} is installed successfully`);
        }, (err)=>{
          if(err.cancelled){
            logger.log('error',`node installation cancelled`);
          }else{
            logger.log('error',`not able to install node ${_version}`);
            logger.log('error',`${err}`);
          }
        });
    }
  });

  function install(){
    var validYes = ['yes', 'y', 'yup', 'yep', 'yo', 'obviously', 'ok', 'hmm'];
    return new Promise((resolve, reject)=>{
      logger.log('info',`node ${_version} is required ....`);
      ask({
        prop: 'ans',
        text: `do you want to install node ${_version} (yes/no)? NOTE: no will exit setup`
      }).then((res)=>{
          res = (res)? res.toLowerCase() : '';
          if(res && validYes.indexOf(res) >= 0){
            Shell.exec('sudo apt-get install n',{silent: true})
              .then((nResult)=>{
                if(nResult.code === 0){

                }
              });
            return resolve(res);
          }
          return reject({cancelled: true});
        }, (err)=>{
          logger.log('error', `err: ${err}`);
          return reject(err);
        });
    });
  }
}