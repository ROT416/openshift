
module.exports = {
  HTML:function(title, list, body, control, userUI=`
    <a href="/signup">회원가입 </a><a href="/signin">로그인</a>`){
    return `
    <!doctype html>
    <html>
    <head>
      <style>
      @import url(//fonts.googleapis.com/earlyaccess/nanumgothic.css);
      </style>
      <link rel="stylesheet" href="css/style.css">
      <link rel="stylesheet" href="../css/style.css">
      <title> Flowers - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <div>
      ${userUI}
      </div>
      <div>
      <h1><a href="/" class="header" >✿ FLOWERS ✿</a></h1>
      </div>
      <div id ="grid">
      ${list}
        <div id = "article" style="padding-top : 35px">
        ${body}
        <br><br>
        ${control}
        </div>
      </div>
    </body>
    </html>
    `;

  },list:function(topics){//상위 페이지 리스트(메인 메뉴)
    var list = '<ol>';
    var i = 0;
    while(i < topics.length && topics[i].title!='회원가입' && topics[i].title!='로그인'){
      list = list + `<li class="a_box"><a href="/${topics[i].link}" class="a_text" >${topics[i].title}</a></li>`;
      i = i + 1;
    }
    list = list+'</ol>';
    return list;


  },HTML2:function(title, list, list2, body, control, userUI=`
    <a href="/signup">회원가입 </a><a href="/signin">로그인</a>`){
    return `
    <!doctype html>
    <html>
    <head>
      <style>
      @import url(//fonts.googleapis.com/earlyaccess/nanumgothic.css);
      </style>
      <link rel="stylesheet" href="../css/style.css">
      <title> Flowers - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <div>
      ${userUI}
      </div>
      <div >
      <h1><a href="/" class="header" >✿ FLOWERS ✿</a></h1>
      </div>
      <div id ="grid">
      ${list}
        <div id = "article">
          <div id = "sub_menu">
          ${list2}
          </div>
          <div id = "sub_article">
          ${body}
          <br><br>
          ${control}
          <br>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;

    },list2:function(topics, parents){//하위 페이지 리스트(서브 메뉴)
    var list = `<ol class="sub_page"> <li class="a_box"><a href="/${parents}" class="a_text" > MAIN </a></li>`;
    var i = 0;
    while(i < topics.length){
      list = list + `<li class="a_box"><a href="/${parents}/${topics[i].link}" class="a_text" >${topics[i].title}</a></li>`;
      i = i + 1;
    }
    list = list+'</ol>';
    return list;
  }



}
