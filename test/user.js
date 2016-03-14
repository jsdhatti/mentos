/**
 * Created by sharique on 3/8/16.
 */
var assert = require('assert');
var User = require('../app/facade/users').v1;
var should = require('should');
var _ = require('lodash');
var Composer = require('../index');
var db = require('../config/db');


var Server;
var userModel = {
  firstName : 'Fake',
  lastName : 'User',
  email: 'test@example.com',
  password: 'password'
};


describe('User model functional test', ()=> {

  before(()=>{
    db.connect('test').once('open', ()=>{
      console.log("Connection with database succeeded.");
    });
  });

  it('Should create user', ()=>{
    return User.create(userModel)
      .then(user => {
        userModel.id = user.id;
        userModel = _.extend(userModel, user.toJSON());
        user.toObject().should.have.property('firstName', 'Fake');
        user.toObject().should.have.property('email', 'test@example.com');
      });
  });

  it.skip('Should get list of users', ()=>{
    return User.index()
      .then(users=>{
        users.length.should.be.greaterThan(0);
      });
  });

  it('Should add project to the user with a single cloning task', ()=>{
    var project = {
      name:'Test project',
      technology : 'AngularJS',
      initialization:[
        {
          id:0,
          name:'Sample repo clone',
          taskType:'git',
          properties:{
            url:'https://github.com/shakefon/consistency.git',
            opType:'clone',
            folderPath:'/home/sharique/Work/TestGround',
            branch:'master'
          }
        }
      ]
    };
    return User.initializeProject(userModel.id, project)
      .then(user => {
        userModel = _.extend(userModel, user.toJSON());
        user.projects.length.should.be.greaterThan(0);
        user.projects[0].initialization.length.should.be.equal(1);
      });
  });

  it.skip('Should not add project to the user due to incomplete data', ()=>{
    var project = {
      technology : 'AngularJS',
      initialization:[
        {
          id:0,
          name:'Sample repo clone',
          taskType:'git',
          properties:{
            url:'https://github.com/shakefon/consistency.git',
            opType:'clone',
            folderPath:'/home/sharique/Work/TestGround',
            branch:'master'
          }
        }
      ]
    };
    return User.addProjectToUser(userModel.id, project)
      .then(user => {
        userModel = _.extend(userModel, user.toJSON());
        user.projects.length.should.be.greaterThan(0);
        user.projects[0].initialization.length.should.be.equal(1);
      }, err =>{
        err.data.length.should.be.greaterThan(0);
      });
  });

  it.skip('update user first Name & last name', ()=>{
    userModel.firstName = 'Sharique';
    userModel.lastName = 'Hasan';
    return User.update(userModel.id, userModel)
      .then(user=>{
        userModel = _.extend(userModel, user.toJSON());
        user.firstName.should.be.equal('Sharique');
        user.lastName.should.be.equal('Hasan');
      });
  });

  it.skip('should update current project list with a workflow', ()=>{
    userModel.projects[0].workflow = [].concat({
      id:0,
      name:'Sample repo pull',
      taskType:'git',
      properties:{
        url:'https://github.com/shakefon/consistency.git',
        opType:'pull',
        folderPath:'/home/sharique/Work/TestGround',
        branch:'master'
      }
    });
    return User.update(userModel.id, userModel)
      .then(user=>{
        userModel = _.extend(userModel, user.toJSON());
        user.projects.length.should.be.greaterThan(0);
        user.projects[0].workflow.length.should.be.greaterThan(0);
        user.projects[0].workflow[0].name.should.be.equal('Sample repo pull');
      });
  });

  after(()=>{
    User.removeAll();
  });

});

describe('User and project integration', ()=>{
  before((done)=>{
    Composer((err, server) =>{
      Server = server;
      should.equal(err, null);
      db.connect('test').once('open', ()=>{
        console.log("Connection with database succeeded.");
        server.start(function () {
          console.log('Started the USER service:' + server.info.uri);
          done();
        });
      });
    });
  });

  it('registers a user', function (done) {
    var req = {
      method: 'POST',
      url: '/api/v1/users',
      payload: {
        firstName: 'Sharique',
        lastName: 'Hasan',
        role:'user',
        email: 'ME@example.com',
        password: '12345678'
      }
    };

    Server.inject(req, function(res) {
      res.statusCode.should.be.equal(200);
      res.headers['content-type'].should.be.equal('application/json; charset=utf-8');
      var body = JSON.parse(res.payload);
      body._id.length.should.be.equal(24);
      body.firstName.should.be.equal('Sharique');
      body.lastName.should.be.equal('Hasan');
      body.email.should.be.equal('me@example.com');
      done();
    });
  });

  it('should not registers a user due to bad data', function (done) {
    var req = {
      method: 'POST',
      url: '/api/v1/users',
      payload: {
        lastName: 'Hasan',
        role:'user',
        email: 'ME@example.com',
        password: '12345678'
      }
    };

    Server.inject(req, function(res) {
      res.statusCode.should.be.equal(400);
      res.headers['content-type'].should.be.equal('application/json; charset=utf-8');
      done();
    });
  });

  after(()=>{
    User.removeAll();
  });

});