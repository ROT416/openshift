var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var template = require('./lib/template.js');
app.use(express.static("public"));
var db = require('./lib/db');

var session = require('express-session');
var FileStore = require('session-file-store')(session);

var topic= require('./lib/topic.js');
var process = require('./lib/process');

app.use(session({
  secret: 'asadlfkj!@#!@#dfgasdg',
  resave: false,
  saveUninitialized : true,
  store: new FileStore()
}));


//메인화면
app.get('/', function(request, response) {
  topic.home(request, response);
});

//상위페이지
app.get('/:mainpageId/', function (request, response) {
  var mId = request.params.mainpageId;
  if(mId.match(/.\../)==null ){
    console.log(mId);
    topic.mainpage(request, response, mId);
  }
});

//하위페이지
app.get('/:mainpageId/:subpageId/', function (request, response) {
  console.log(request.params.subpageId);
  topic.subpage(request, response);
});



//회원가입 프로세스
app.post('/signup_process', function(request, response){
  console.log("회원가입");
  process.signup_process(request, response);
});

//로그인 프로세스
app.post('/signin_process', function(request, response){
  console.log("로그인");
  process.signin_process(request, response);
});

//덧글 작성 프로세스
app.post('/update_process', function(request, response){
  console.log("덧글 작성");
  process.update_process(request, response);
});

//덧글 삭제 프로세스
app.post('/delete_process', function(request, response){
  console.log("덧글 작성");
  process.delete_process(request, response);
});



//404
app.use(function(req, res, next) {
  res.status(404).send('페이지를 찾을 수 없습니다!');
});

app.listen(3000, function() {
  console.log('포트 번호 : 3000');
});
