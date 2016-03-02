'use strict';

var epoch = require('../helper/epoch');

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
    console.log(`calculating stats.. ${diff} ms`);
  }

  end(){
    this.stats.endedAt = epoch.ms();
    this.calculateStats();
  }
}

module.exports = BaseTask;