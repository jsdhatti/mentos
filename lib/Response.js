'use strict';

class Response {
	constructor(status, message){
		if(!status || typeof status !== 'number')
			throw new Error('Response status not found or invalid');
		this.status = status;
		this.message = message || '';
	}
}

class Success extends Response {
	constructor(status, message, data) {
		super(status,message);
		this.data = data || {};
	}
}

class Error extends Response {
	constructor(status, message, data) {
		super(status,message);
		this.data = data || {};
	}
}

var response = {
	Success: Success,
	Error: Error
};

module.exports = response;