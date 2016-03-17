
'use strict';

var _ = require('lodash');
var event = require('events');
var taskFactory = require('../helper/TaskFactory');
var Async = require('async');

class WorkFlow {
  constructor(rawTasks){
    if(_.isEmpty(rawTasks))
      throw new Error('tasks not supplied');
    this.tasks = processTasks(rawTasks);
    this.completed = [];
    this.index = -1;
    this.inprogress = null;
    this.ee = new event.EventEmitter();
  }

  execute(){
    return new Promise((resolve, reject)=>{
      var tasks = [];
      for(var i=0;i<this.tasks.length;i++){
        (function(i, that){
          tasks.push(function(callback){
            var task;
            task = that.inprogress = that.tasks[i];
            that.index = i;
            that._emit('newtask', task);

            task.on('log', (log)=>{
              that._emit('log', log);
            });

            task.start()
              .then(()=>{
                task.end();
                that.completed.unshift(task);
                return callback(null);
              },(err)=>{
                return callback(err);
              });
          });
        })(i, this);
      }

      Async.waterfall(tasks, (err, result)=>{
        if(err){
          this._emit('fail', {});
          this._emit('done', this.completed);
          return reject(err);
        }
        this._emit('success', this.completed);
        this._emit('done', this.completed);
        return resolve(this.completed);
      });
    });
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
    return (_.indexOf(['newtask', 'success', 'fail', 'done', 'log'], event)) >= 0;
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

