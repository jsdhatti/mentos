'use strict';

var should = require('should');
var storage = require('../cli/lib/localstorage');
var Shell = require('../lib/Shell');
var pathStep = require('../helper/path');
const cleanup = require('../helper/cleanup');
const path = 'storagetestground';
const folder = pathStep.stepBack(__dirname, 2)+"/"+path;

describe('Localstorage', function() {

  before(function(done){
    cleanup(folder, done);
  });

  it('should create file and return empty obj - init()', function(){
    return storage.init({
      path: folder
    }).then((data)=>{
        (data).should.be.type('object');
        (data).should.have.keys();
      }, (err)=>{
        should.fail(err);
      });
  });

  it('should read file and return storage obj - init()', function(){
    return storage.init({
      path: folder
    }).then((data)=>{
        should(data).be.type('object');
      }, (err)=>{
        should.fail(err);
      });
  });

  it('should add obj into storage variable - add(key,val)', function(){
    return storage.init({
      path: folder
    }).then(()=>{
        storage.add('someKey', 'someValue').should.have.keys('someKey');
      }, (err)=>{
        should.fail(err);
      });
  });

  it('should add obj into storage variable - add(obj)', function(){
    return storage.init({
      path: folder
    }).then(()=>{
        storage.add({key: 'someKey', value: 'someValue'}).should.have.keys('someKey');
      }, (err)=>{
        should.fail(err);
      });
  });

  it('should add obj into storage file - read()', function(){
    return storage.init({
      path: folder
    }).then(()=>{
        storage.add({key: 'someOtherKey', value: 'someOtherValue'});
        return storage.read()
          .then((updatedStorage)=>{
            (updatedStorage).should.have.property('someOtherKey');
          });

      }, (err)=>{
        should.fail(err);
      });
  });

  it('should delete obj from storage(memory)', function(){
    return storage.init({
      path: folder
    }).then(()=>{
        storage.del({key: 'someOtherKey', value: 'someOtherValue'});
        storage.get().should.not.have.property('someOtherKey');
      }, (err)=>{
        should.fail(err);
      });
  });

  it('should delete obj from storage(file)', function(){
    return storage.init({
      path: folder
    }).then(()=>{
        storage.del('someKey');
        return storage.read()
          .then((updated)=>{
            (updated).should.not.have.property('someKey');
          });
      }, (err)=>{
        should.fail(err);
      });
  });

  after(function(done){
    cleanup(folder, done);
  });

});