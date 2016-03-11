
'use strict';

var ask = require('../helper/ask');
var logger = require('../helper/logger').init();
var Shell = require('../../lib/Shell');
const _version = 'v5.0.0';

module.exports = function(args){
  logger.log('info','setting up...');
  logger.log('info','checking node v5.0.0 ....');
  node();
};

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