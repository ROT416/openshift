
function userSignUpCheck() {
    var re = /^[a-zA-Z0-9]{4,12}$/; // 아이디/패스워드 정규식
    var re2 = /^.{1,8}$/; // 닉네임/이름 정규식

    var id = document.getElementById("id");
    var pw = document.getElementById("pw");
    var nickname = document.getElementById("nickname");
    var name = document.getElementById("name");

    if(!check(re,id,"아이디는 4자 ~ 12자의 영문 대소문자와 숫자로 작성해주세요.")) return false;
    if(!check(re,pw,"패스워드 4자 ~ 12자의 영문 대소문자와 숫자로 작성해주세요.")) return false;
    if(!check(re2,nickname,"닉네임은 한 글자에서 여덟 글자로 작성할 수 있습니다.")) return false;
    if(!check(re2,name,"이름을 정확히 적어주세요.")) return false;

    console.log("");
}

function check(re, what, message) {
    if(re.test(what.value)) return true;
    alert(message);
    what.value = "";
    what.focus();
}
