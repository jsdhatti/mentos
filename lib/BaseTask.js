'use strict';

var epoch = require('../helper/epoch');
var _ = require('lodash');
var event = require('events');
var ee = new event.EventEmitter();
var logger = require('../helper/logger').init();

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

  log(message, type, dontSend){
		type = type || 'info';
    logger.log(type, message);

    if(!dontSend){
      this._emit('log', message);
    }
  }

  on(event, cb) {
    if(this.isValidEvent(event)){
      ee.on(event, cb);
      return this;
    }
    throw new Error(`${event} is not a valid event`);
  }

  _emit(event, data){
    ee.emit(event, data);
  }

  isValidEvent(event){
    return (_.indexOf(['log'], event)) >= 0;
  }

}

module.exports = BaseTask;