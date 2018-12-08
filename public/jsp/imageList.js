
function showImg(season, n){
  var i=0;
  while( i < n){
    document.write(`<img src="../img/${season}_${i+1}.png" style="width:  150px">`);
    i= i+1;

  }
}
