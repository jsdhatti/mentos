
function stepBack(path, n){
  var arr = path.split('/');
  return arr.slice(0, arr.length - n).join('/');
}

module.exports.stepBack = stepBack;