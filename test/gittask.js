'use strict';

var assert = require('assert');
var path = require('../helper/path');
var Shell = require('../lib/Shell');
var testground = `${path.stepBack(__dirname, 2)}/testground`;

describe('GitTask - clone', function(){
  this.timeout(60000);
  before(function(){
    Shell.cmd().exec(`rm -r ${testground}`);
  });
  beforeEach(function(){

  });
  it('can clone public repo with http', function(done){
    var GitTask = require('../lib/GitTask');
    var creds = {
      username: '',
      password: ''
    };
    var opts = {
      url: 'https://github.com/t-khan-k/angular-listview.git',
      opType: 'clone',
      folderPath: testground,
      logsEnabled: false
    };
    var git = new GitTask(0, 'http clone', creds, opts);
    git.start().then(()=>{
      var result = Shell.cmd().exec(`cd ${testground} && ls | grep angular-listview`);
      assert.equal(0, parseInt(result.code), 'result code should be 0');
      done();
    });
  });
  after(function() {
    Shell.cmd().exec(`rm -r ${testground}`);
  });
});