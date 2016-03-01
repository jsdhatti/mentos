'use strict';

var moment = require('moment');

function ms(){
	return moment().valueOf();
}

module.exports.ms = ms;