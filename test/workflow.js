'use strict';

var assert = require('assert');
var WorkFlow = require('../lib/WorkFlow');
var Shell = require('../lib/Shell');
const testingGroundPath = '/home/hsmsharique/work/projects/mentosTesting';

describe('Work Flow basics', function() {

  it('should have equal number of tasks from task factory as of raw tasks', function(){
    //console.log('Removing previously cloned projects');
    //Shell.cmd().exec('rm -r ' + testingGroundPath + '/*');

    var rawTasks0 = {
      _id:'some id',
      workFlow:[
        {
          id:0,
          parent:[],
          name: 'my pull',
          type:'git',
          properties:{
            url:'https://github.com/t-khan-k/angular-listview.git',
            branch:'develop',
            user:'hsmsharique',
            pwd:'hsmsh2912everee'
          }
        },
        {
          id:1,
          parent:[0],
          name: 'my shell1',
          type:'shell',
          properties:{
            command:'npm install',
            path:'' //can be empty
          }
        },
        {
          id:2,
          parent:[0],
          name: 'my shell2',
          type:'shell',
          properties:{
            command:'bower install',
            path:'' //can be empty
          }
        }
      ]
    };
    var workFlow0 = new WorkFlow(rawTasks0.workFlow);
    assert.equal(workFlow0.tasks.length, rawTasks0.workFlow.length);
	});

  it('should clone the open-source repo in workflow and finishes the build', function(){
    console.log('Removing previously cloned projects');
    Shell.cmd().exec('rm -r ' + testingGroundPath + '/angular-listview');
    this.timeout(15000);
    var rawTasks1 = {
      _id:'some id',
      workFlow:[
        {
          id:0,
          parent:[],
          name: 'my pull',
          type:'git',
          properties:{
            url:'https://github.com/t-khan-k/angular-listview.git',
            branch:'develop',
            opType:'clone',
            folderPath : testingGroundPath
          }
        }
      ]
    };
    var workFlow1 = new WorkFlow(rawTasks1.workFlow);
    workFlow1.execute();
	});

  it('should test single workflow new task event after pull', function(done){

    this.timeout(15000);

    var rawTasks2 = {
      _id:'some id',
      workFlow:[
        {
          id:0,
          parent:[],
          name: 'angular-listview pull',
          type:'git',
          properties:{
            url:'https://github.com/t-khan-k/angular-listview.git',
            branch:'develop',
            opType:'pull',
            folderPath : testingGroundPath + '/angular-listview'
          }
        }
      ]
    };

    var workFlow2 = new WorkFlow(rawTasks2.workFlow);
    workFlow2.on('newtask', (task)=>{
      try{
        assert.equal(task.name, 'angular-listview pull');
        done()
      }
      catch(e){
        done(e);
      }

    });
    workFlow2.execute();

  });

  it('should run npm install in the repo after cloning', function(done){

    this.timeout(150000);

    var rawTasks3 = {
      _id:'some id',
      workFlow:[
        {
          id:0,
          parent:[],
          name: 'consistency pull from master branch',
          type:'git',
          properties:{
            url:'https://github.com/shakefon/consistency.git',
            branch:'master',
            opType:'pull',
            folderPath:testingGroundPath + '/consistency'
          }
        },
        {
          id:1,
          parent:[0],
          name: 'npm task for consistency project',
          type:'shell',
          properties:{
            command:'npm install',
            path : testingGroundPath + '/consistency'
          }
        }
      ]
    };

    var workFlow3 = new WorkFlow(rawTasks3.workFlow);

    workFlow3.on('log',(data)=>{
      console.log("logging: ",data);
    });

    workFlow3.execute().then((tasks)=>{
      console.log("Build finished ",tasks);
      done();
    }, (err)=>{
      console.error("err: ",err);
      console.info('Build failed');
      done(err)
    });

  });



});