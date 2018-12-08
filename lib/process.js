var db = require('./db');
var template = require('./template.js');
var fs = require('fs');
var qs = require('querystring');

exports.signup_process = function(request, response){
  var body = '';
  request.on('data', function(data){
    body = body + data;
  });

  request.on('end', function(){
    var post = qs.parse(body);

    //아이디 /닉네임 중복 체크
      db.query(`SELECT * from user WHERE id=?`,[post.id],
      function(error, user){
        if(error){
          throw error;
        }
        if(user[0] == null){
          db.query(`SELECT * from user WHERE nickname=?`,[post.nickname],
            function(error, user2){
              if(user2[0] ==null){
                db.query(`
                  INSERT INTO user (id, password, nickname, name)
                    VALUES(?, ?, ?, ?)`,
                  [post.id, post.password, post.nickname, post.name],
                  function(error, result){
                    if(error){
                      throw error;
                    }
                    console.log("회원가입 완료");
                    request.session.is_logined = true;
                    request.session.nickname = post.nickname;
                    response.writeHead(302, {Location: `/`});
                    response.end();
                  }
                );
              }else{
                console.log("닉네임 중복");
                response.send('이미 존재하는 닉네임입니다.');

              }
          });
        }else{
          console.log("아이디 중복 ");
          response.send('이미 존재하는 아이디입니다.');
        }
      }
    );
  });
}


exports.signin_process = function(request, response){
  var body = '';
  request.on('data', function(data){
    body = body + data;
  });

  request.on('end', function(){
    var post = qs.parse(body);

    db.query(`SELECT * FROM user WHERE id=?`,[post.id], function(error2, login_id){
      if (login_id[0] == undefined){
        console.log("아이디 X");
        response.send('아이디가 맞지 않습니다.');
      }
      else{
        if (login_id[0].password == post.password){
          request.session.is_logined = true;
          request.session.nickname = login_id[0].nickname;
          response.redirect('/');
        }else{
          console.log('비밀번호 X');
          response.send('비밀번호가 맞지 않습니다.');
        }
      }
    });
  });
}


exports.update_process = function(request, response){
  var body = '';
  request.on('data', function(data){
    body = body + data;
  });

  request.on('end', function(){
    var post = qs.parse(body);
    var address = post.pageid;
    var replynum = post.replynum;
    var usernum = post.usernum;
    var address = post.address;

    var description = post.description.replace(/<br\/>/ig, "\n").replace(/<(\/)?([a-zA-Z0-9]*)(\s[a-zA-Z0-9]*=[^>]*)?(\s)*(\/)?>/ig, "");

    if(description != "" && usernum != -1){
      db.query(`
        INSERT INTO reply (pageid, replynum, userid, description)
          VALUES(?, ?, ?, ?)`,
        [post.pageid, post.replynum, post.usernum, description],
        function(error, result){
          if(error){
            throw error;
          }
          console.log("덧글 작성 완료");
          response.redirect(`${address}`);
          response.end();
        }
      );
    }else{
      if(usernum == -1){
        response.send('로그인 해주세요!');
      }else{
        response.send('내용을 입력해주세요!')
      }
    }
  });
}


exports.delete_process = function(request, response){
  var body = '';
  request.on('data', function(data){
    body = body + data;
  });
  request.on('end', function(){
    var post = qs.parse(body);
    var pageid = post.pageid;
    var replynum = post.replynum;
    var address = post.address;
    var iswriter = post.iswriter;

    console.log(typeof(iswriter));
    if(iswriter == 'true'){
      db.query('DELETE FROM reply WHERE pageid =? and replynum =?', [pageid, replynum], function(error, result){
        if(error){
          throw error;
        }
        response.redirect(`${address}`);
      });

    }else{//
     response.send('작성자만 삭제 가능합니다.');
    }
  });
}
