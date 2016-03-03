'use strict';

var epoch = require('../helper/epoch');
var path = require('path');
var winston = require('winston');
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      name: 'console-file',
      filename: path.join(__dirname, '..', 'logs') + 'filelog-console.log',
      level: 'info'
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: path.join(__dirname, '..', 'logs') + 'filelog-error.log',
      level: 'error'
    })
  ]
});

class BaseTask{
  constructor(name){
    this.name = name;
    this._status = 'notstarted';
    this.stats = {
      startedAt: epoch.ms(),
      endedAt: 0
    };
  }

  status(val){
    if(typeof val !== 'undefined')
      this._status = val;
    return this._status;
  }

  start(){
    throw new Error('Method not implemented exception');
  }

  stop(){
    throw new Error('Method not implemented exception');
  }

  calculateStats(){
    let diff = this.stats.endedAt - this.stats.startedAt;
    this.log(`calculating stats.. ${diff} ms`);
  }

  end(){
    this.stats.endedAt = epoch.ms();
    this.calculateStats();
  }

  log(message, type='console'){
    logger.log(type, message);
  }

}

module.exports = BaseTask;