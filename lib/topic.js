var db = require('./db');
var template = require('./template.js');
var fs = require('fs');
var qs = require('querystring');

function userIsLogined(request, response){
  if(request.session.is_logined){
    return true;
  } else{
    return false;
  }
}

function setUserUI(request, response){
  var userUI=`<a href="/signup">회원가입 </a><a href="/signin">로그인</a>`
  if(userIsLogined(request, response)){
    userUI=`<a>${request.session.nickname} </a><a href="/logout">로그아웃</a>`
  }
  return userUI;
}

function blockNonUser(request, response){
  if(!userIsLogined(request, response)){
    response.redirect('/');
    console.log("????");
    response.end();
    return false;
  }
}


exports.home = function(request, response){
  var userUI = setUserUI(request, response);
  db.query(`SELECT * FROM main_page`, function(error, topics){
    fs.readFile(`./lib/main`, 'utf8', function(err, description){
      var title = '< MAIN >';
      var list = template.list(topics);
      var html = template.HTML(title, list,
        `${description}`,
        ``,userUI
      );
      response.send(html);
    });
  });
}


exports.mainpage = function(request, response, mainpageId){
  if(mainpageId=='logout'){
    request.session.destroy(function(err){
      response.redirect('/');
    });
  }else if((mainpageId=='signup' || mainpageId=='signin') && request.session.is_logined ==true){
    response.redirect('/');
  }else{
    db.query(`SELECT * FROM main_page`, function(error,main_menu){
      if(error) throw error;

      db.query(`SELECT * FROM main_page WHERE link=?`,[mainpageId], function(error2, topic){
        if(error2) throw error2;

        db.query(`SELECT * FROM page WHERE parents=?`, [topic[0].id], function(error3, son){
          if(error3) throw error3;

          var title = topic[0].title;
          var description = topic[0].description;

          if(son.length != 0){
            var parrents_list = template.list(main_menu);
            var list = template.list2(son, topic[0].link);
            var html = template.HTML2(title, parrents_list, list,
                `<h2>< ${title} ></h2>${description}`,
                ``, setUserUI(request, response)
            );
            response.send(html);

          }else{
            var list = template.list(main_menu);
            var html = template.HTML(title, list,
              `<h2>< ${title} ></h2>${description}`,
              ``, setUserUI(request, response)
            );
            response.send(html);
          }
        });
      });
    });
  }
}


exports.subpage= function(request, response){
  db.query(`SELECT * FROM main_page`, function(error,main_menu){
    if(error) throw error;

    var i = 0;
    var main_link, main_id;
    while(i < main_menu.length){
      if(main_menu[i].link == request.params.mainpageId) {
        main_link = main_menu[i].link;
        main_id = main_menu[i].id;
      }
      i = i+1;
    }

    db.query(`SELECT * FROM page WHERE parents=?`,[main_id], function(error2, sub_menu){
    if(error2) throw error2;

    db.query(`SELECT * FROM page WHERE link=?`,[request.params.subpageId], function(error3, topic){
      if(error3) throw error3;

      db.query(`SELECT * FROM reply WHERE pageid=?`,[request.params.mainpageId], function(error4, replys){
        if(error4) throw error4;

        var title = topic[0].title;
        var description = topic[0].description;
        var parrents_list = template.list(main_menu);
        var list = template.list2(sub_menu, main_link);

        var reList =``;
        db.query(`SELECT * FROM reply LEFT JOIN user ON reply.userid=user.usernum WHERE reply.pageid=?`,[topic[0].id], function(error5, comments){
          if(error5) throw error5;

          var address = `${request.params.mainpageId}/${request.params.subpageId}`;

          var owner = request.session.nickname;
          var usernum = -1;
          if(owner==undefined ){
            owner='비회원'
          }

          db.query(`SELECT * FROM user WHERE nickname=?`,[owner], function(error6, user){
            if(error6) throw error6;

            var usernum = -1;
            if(user[0]) {
              usernum = user[0].usernum;
            }

            var r=0;
            var i = 0;
            while (i < comments.length) {
              reList = reList + `<form action="/delete_process" name="delform_${comments[i].replynum}" method="post"><strong>
              ${comments[i].replynum} - `
              + comments[i].nickname + " | </strong>"+ comments[i].description+` `
              +`
                <input type="hidden" name="pageid" value="${comments[i].pageid}">
                <input type="hidden" name="replynum" value="${comments[i].replynum}">
                <input type="hidden" name="iswriter" value="${usernum==comments[i].userid}">
                <input type="hidden" name="address" value="${address}">
                <input type="submit" value="x" style="word-break:nowrap"><br>
                </form>`, setUserUI(request, response);
              if(comments[i].replynum!=null)r=comments[i].replynum;
              i=i+1;
            }

            var html = template.HTML2(title, parrents_list, list,
              `<h2>< ${title} ></h2>${description}`,
              `
              <h2> < COMMENT > </h2>
              <div class ="reply">${reList}</div><br>
              +
              <form action="/update_process" method="post">
                <input type="hidden" name="pageid" value="${topic[0].id}">
                <input type="hidden" name="replynum" value="${r+1}">
                <input type="hidden" name="usernum" value="${usernum}">
                <input type="hidden" name="address" value="${address}">
                <p>${owner} : <input id="dv" type="text" name="description" placeholder="description" value="" style="width:400px; height=:50px">
                  <input type="submit" value="입력">
                </p>
              </form>
              <br>`, setUserUI(request, response)
            );

            response.writeHead(200);
            response.end(html);
          });

        });
      });

    });
 });
  });
}
