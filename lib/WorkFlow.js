
'use strict';

var _ = require('lodash');
var events = require('events');
var eventEmitter = new events.EventEmitter();
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
	}

	execute(){
		return new Promise((resolve, reject)=>{
			var tasks = [];
			for(var i=0;i<this.tasks.length;i++){
				(function(i, that){
					tasks.push(function(callback){
						var task = that.tasks[i];
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
					return reject(err);
				}
				return resolve(this.completed);
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

