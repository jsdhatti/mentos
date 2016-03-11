'use strict';

var winston = require('winston');
var path = require('path');
var Shell = require('../../lib/Shell');

function init(){
  let folder = path.join(__dirname, '..', 'logs/');
  Shell.cmd().exec(`mkdir -p ${folder}`);
  return new (winston.Logger)({
    transports: [
      new (winston.transports.Console),
      new (require('winston-daily-rotate-file'))({
        name: 'info-file',
        filename: `${folder}info.log`,
        level: 'info',
        datePattern: '.dd-MM-yyyy'
      }),
      new (require('winston-daily-rotate-file'))({
        name: 'error-file',
        filename: `${folder}error.log`,
        level: 'error',
        datePattern: '.dd-MM-yyyy'
      })
    ]
  });
}

module.exports.init = init;