'use strict';

var shell = require('shelljs');

class Shell {

  static cmd(){
    return shell;
  }

  static exec(command, opts, path){
    return new Promise((resolve, reject) => {
      if(path){
        console.log("before: ",Shell.cmd().exec('pwd'));
        Shell.cmd().exec('cd /var/lib',(code, out, err)=>{
          console.log("after: ",Shell.cmd().exec('pwd'));
          console.log("result: ",code, out, err);
          if(code !== 0){
            throw new Error(`${path} doesnt exist`);
          }
        });
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