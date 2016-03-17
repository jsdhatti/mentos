'use strict';

module.exports.add = add;
module.exports.del = del;
module.exports.get = get;
module.exports.init = init;
module.exports.read = read;

/////////////////////////////

const _ = require('lodash');
const fs = require('fs');
const filename = 'dat.json';
var _storage;
var file;

function get(key){
  if(!_storage) throw 'storage not initiated';
  if(!key)
    return clone(_storage);
  return (_storage[key])? clone(_storage[key]) : null;
}

function add(){
  if(!_storage) throw 'storage not initiated';
  let args = arguments;

  // Destructure assignment(es6) of arguments
  if(args.length === 2){
    _storage[args[0]] = args[1];
  }else if(args.length === 1){
    _storage[args[0].key] = args[0].value;
  }
  update();
  return clone(_storage);
}

function del(obj){
  if(!_storage) throw 'storage not initiated';
  let key = (typeof obj === 'object')? obj.key : obj;
  let deleted = clone(_storage[key]);
  delete _storage[key];
  update();
  return deleted;
}

function update(){
  return new Promise((resolve, reject)=>{
    fs.writeFile(file, JSON.stringify(_storage), (err)=>{
      if(err){
        return reject(err);
      }
      return resolve({});
    });
  });
}

function read(){
  return new Promise((resolve, reject)=>{
    fs.readFile(file, (err, data)=>{
      if (err) {
        return reject(err);
      }
      _storage = JSON.parse(data.toString());
      return resolve(_storage);
    });
  });
}

function init(opts){
  if(!opts || !opts.path) throw 'path not supplied';

  return new Promise((resolve, reject)=>{
    let _path = opts.path;
    file = `${_path}/${filename}`;
    fs.stat(file, function(err, stat) {
      if(err == null) {
        fs.readFile(file, (err, data)=>{
          if (err) {
            return reject(err);
          }
          _storage = JSON.parse(data.toString());
          return resolve(_storage);
        });
      } else if(err.code == 'ENOENT') {
        fs.mkdir(_path, (err)=>{
          if(err){
            return reject(err);
          }
          fs.writeFile(file, '{}', (err)=>{
            if(err){
              return reject(err);
            }
            _storage = {};
            return resolve({});
          });
        });
      } else {
        return reject(err);
      }
    });
  });
}

function clone(o){
  return _.cloneDeep(o);
}