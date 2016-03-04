'use strict';

var shell = require('shelljs');

class Shell {

  static cmd(){
    return shell;
  }

  static exec(command, opts, path){
    return new Promise((resolve, reject) => {
      if(path){
        var result = Shell.cmd().cd(path);
				if(result === null){
					reject(new Error(`${path} not found`));
				}
      }
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