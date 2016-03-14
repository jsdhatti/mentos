'use strict';

var epoch = require('../helper/epoch');
var _ = require('lodash');
var event = require('events');
var logger = require('../helper/logger').init();

class BaseTask{
  constructor(id, name, opts){
    this.id = id;
    this.name = name;
    this.status = 'notstarted';
    this.stats = {
      startedAt: 0,
      endedAt: 0
    };
    this.logsEnabled = opts && opts.logsEnabled;
    this.ee = new event.EventEmitter();
  }

  start(){
    this.log('starting');
    this.stats.startedAt = epoch.ms();
    this.status = 'inprogress';
  }

  calculateStats(){
    let diff = this.stats.endedAt - this.stats.startedAt;
    diff /= 1000;
    this.log(`finished in: ${diff}s`);
  }

  end(){
    this.stats.endedAt = epoch.ms();
    this.status = 'ended';
    this.calculateStats();
  }

  log(message, type, dontSend){
    if(!this.logsEnabled)  return;

		type = type || 'info';
    logger.log(type, message);

    if(!dontSend){
      this._emit('log', message);
    }
  }

  on(event, cb) {
    if(this.isValidEvent(event)){
      this.ee.on(event, cb);
      return this;
    }
    throw new Error(`${event} is not a valid event`);
  }

  _emit(event, data){
    this.ee.emit(event, data);
  }

  isValidEvent(event){
    return (_.indexOf(['log'], event)) >= 0;
  }

}

module.exports = BaseTask;