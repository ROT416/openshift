var slideIndex = 0;
var slideMoveIndex= 1;

window.onload = function () {
  showSlides();
}



function showSlides() { //자동 슬라이드
  var i;
  var slides = document.getElementsByClassName("imgSlides");
  var dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
     slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
  setTimeout(showSlides, 2000); // 2초마다 바뀜
}


function currentSlide(n) {
  moveSlides(slideMoveIndex = n);
}

function moveSlides(n) {
  var i;
  var slides = document.getElementsByClassName("imgSlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideMoveIndex = 1}
  if (n < 1) {slideMoveIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideMoveIndex-1].style.display = "block";
  dots[slideMoveIndex-1].className += " active";
  slideIndex=slideMoveIndex-1;
}
