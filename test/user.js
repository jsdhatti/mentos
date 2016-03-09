/**
 * Created by sharique on 3/8/16.
 */
var assert = require('assert');
var User = require('../app/facade/user');
var db = require('../db');
var should = require('should');
var _ = require('lodash');

var userModel = {
  firstName : 'Fake',
  lastName : 'User',
  email: 'test@example.com',
  password: 'password'
};

db.init('test');

describe.only('User model functional test', ()=> {

  it('Should create user', ()=>{
    return User.create(userModel)
      .then(user => {
        userModel.id = user.id;
        userModel = _.extend(userModel, user.toJSON());
        user.toObject().should.have.property('firstName', 'Fake');
        user.toObject().should.have.property('email', 'test@example.com');
      });
  });

  it('Should get list of users', ()=>{
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
    return User.addProjectToUser({email:'test@example.com'}, project)
      .then(user => {
        userModel = _.extend(userModel, user.toJSON());
        user.projects.length.should.be.greaterThan(0);
        user.projects[0].initialization.length.should.be.equal(1);
      });
  });

  it('Should not add project to the user due to incomplete data', ()=>{
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
    return User.addProjectToUser({email:'test@example.com'}, project)
      .then(user => {
        userModel = _.extend(userModel, user.toJSON());
        user.projects.length.should.be.greaterThan(0);
        user.projects[0].initialization.length.should.be.equal(1);
      }, err =>{
        err.data.length.should.be.greaterThan(0);
      });
  });

  it('update user first Name & last name', ()=>{
    userModel.firstName = 'Sharique';
    userModel.lastName = 'Hasan';
    return User.update(userModel.id, userModel)
      .then(user=>{
        userModel = _.extend(userModel, user.toJSON());
        user.firstName.should.be.equal('Sharique');
        user.lastName.should.be.equal('Hasan');
      });
  });

  it('should update current project list with a workflow', ()=>{
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
        console.log(userModel);
        user.projects.length.should.be.greaterThan(0);
        user.projects[0].workflow.length.should.be.greaterThan(0);
        user.projects[0].workflow[0].name.should.be.equal('Sample repo pull');
      });
  });

  after(()=>{
    User.removeAll();
  });

});