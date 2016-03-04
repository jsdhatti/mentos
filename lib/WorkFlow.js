
'use strict';

var _ = requrie('lodash');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var taskFactory = require('../helper/TaskFactory');

class WorkFlow {
  constructor(rawTasks){
    if(_.isEmpty(rawTasks))
      throw new Error('tasks not supplied');
    this.tasks = processTasks(rawTasks);
    this.completed = [];
    this.index = -1;
    this.inprogress = null;
  }

  execute(){
    return new Promise((resolve, reject)=>{
      this.inprogress = this._next();
      eventEmitter.emit('doorOpen','opening');
      if(!this.inprogress){
        eventEmitter.emit('doorClosed','closing');
        this.end();
        return resolve(this.completed);
      }
      this.inprogress.start()
        .then(()=>{
          this.inprogress.end();
          this.completed.unshift(this.inprogress);
          this.execute();
        });
    });
  }

  on(event) {
    if(this.isValidEvent(event))
      return new Promise((resolve, reject)=> {
        eventEmitter.on(event, ()=> {
          resolve();
        });
      });
    throw new Error('cant listen to invalid event.');
  }

  _next(){
    return this.tasks.shift();
  }

  isValidEvent(event){
    return (_.indexOf(['doorOpen', 'doorClosed'], event)) >= 0;
  }

  isStarted(){
    return (this.index >= 0);
  }

  end(){
    this.index = -1;
    this.inprogress = null;
  }
}

module.exports = WorkFlow;

function processTasks(raw){
  var tasks = [];
  _.each(raw, (item)=>{
    tasks.push(taskFactory.create(item));
  });
  return tasks;
}

