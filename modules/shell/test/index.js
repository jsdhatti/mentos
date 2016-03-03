'use strict';

var assert = require('assert');
var ShellTask = require('../ShellTask');


describe.only('Shell Task', function() {

	it('should pass [ls] command', function(){

		var command = new ShellTask('ls command', 'ls -l');
		return command.start()
			.then(function(result){
				assert.equal(0, result.code);
			});
	});

	it('should not allow [some] command', function(){

		var command = new ShellTask('some command', 'some');
		return command.start()
			.then(function(result){
				assert.equal(0, result.code);
			}, function(result){
				assert.notEqual(0, result.code);
			});

	});

});