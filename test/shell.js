'use strict';

var assert = require('assert');
var ShellTask = require('../modules/shell/ShellTask');


describe.only('Shell Task', function() {

	it('should pass [ls] command', function(){

		var command = new ShellTask(0, 'ls command', 'ls -l', {path: './modules'});
		return command.start()
			.then(function(result){
				console.log(result.output);
				assert.equal(0, result.code);
			});
	});

	it.skip('should not allow [some] command', function(done){

		var command = new ShellTask(1, 'some command', 'some');
		return command.start()
			.then(function(result){
				assert.equal(0, result.code);
			}, function(result){
				assert.notEqual(0, result.code);
			})

	});

});