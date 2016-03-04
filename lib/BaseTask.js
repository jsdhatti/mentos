'use strict';

var epoch = require('../helper/epoch');
var path = require('path');
var winston = require('winston');
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console),
    new (winston.transports.File)({
      name: 'console-file',
      filename: path.join(__dirname, '..', 'logs') + 'console.log',
      level: 'info'
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: path.join(__dirname, '..', 'logs') + 'error.log',
      level: 'error'
    })
  ]
});

class BaseTask{
  constructor(id, name){
    this.id = id;
    this.name = name;
    this.status = 'notstarted';
    this.stats = {
      startedAt: 0,
      endedAt: 0
    };
  }

  status(val){
    if(typeof val !== 'undefined')
      this.status = val;
    return this.status;
  }

  start(){
    this.log('starting');
    this.stats.startedAt = epoch.ms();
  }

  calculateStats(){
    let diff = this.stats.endedAt - this.stats.startedAt;
    diff /= 1000;
    this.log(`finished in: ${diff}s`);
  }

  end(){
    this.stats.endedAt = epoch.ms();
    this.calculateStats();
  }

  log(message, type){
		type = type || 'info';
    logger.log(type, message);
  }

}

module.exports = BaseTask;