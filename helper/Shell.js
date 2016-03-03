'use strict';

var shell = require('shelljs');

class Shell {

  static cmd(){
    return shell;
  }

  static exec(command, opts){
    return new Promise((resolve, reject) => {
      shell.exec(command, opts || {}, (code, out, error) =>{
        if(code !== 0){
          return reject({ code:code, output:error });
        }
        return resolve({ code:code, output:out });
      });
    });
  }
}

module.exports = Shell;