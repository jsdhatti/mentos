'use strict';


var Promise = require('bluebird');
var terminal = Promise.promisify(require('child_process').exec);

function exec(command){
    return new Promise((resolve, reject)=>{
        terminal(command)
            .then(resolve, reject);
    })
}

module.exports = exec;



