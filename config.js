'use strict';

var _ = require('lodash');
var process = require('process');

var envs = {
	dev: {
		env: 'dev',
		db: 'mentos-dev-db',
		hostname: 'localhost'
	},
	prod: {
		env: 'prod',
		db: 'mentos-prod-db',
		hostname: 'localhost'
	}
};

module.exports = function(){
	let env = process.argv[2] || 'dev';
	return _.cloneDeep(envs[env]);
};