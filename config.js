'use strict';

var _ = require('lodash');
var process = require('process');

var envs = {
	dev: {
		env: 'dev',
		db: 'mentos-dev-db',
		hostname: '127.0.0.1'
	},
	prod: {
		env: 'prod',
		db: 'mentos-prod-db',
		hostname: '127.0.0.1'
	}
};

module.exports = function(){
	let env = process.argv[2] || 'dev';
	return _.cloneDeep(envs[env]);
};