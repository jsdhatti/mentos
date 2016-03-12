'use strict';

var shell = require('shelljs');

class Shell {

  static cmd(){
    return shell;
  }

  static exec(command, opts, path, cb){
    return new Promise((resolve, reject) => {
      let obj = {};
      if(path){
        var result = Shell.cmd().cd(path);
				if(result === null){
					reject(new Error(`${path} not found`));
				}
      }

      var cmd = shell.exec(command, opts || {});

      cmd.on('error', reject);
      cmd.on('exit', resolve);

      cmd.stdout
        .on('data', cb);

      cmd.stderr
        .on('data', cb);

      cmd.on('close', (code)=>{
      });

    });
  }
}

module.exports = Shell;