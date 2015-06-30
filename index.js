
var through = require('through');

module.exports=function(){
  var arr, write, end;
  arr = [];
  write = function(data){
    arr.push(new Buffer(data));
  };
  end = function(){
    this.emit('data',Buffer.concat(arr));
    this.emit('end');
  };
  return through.call(this,write, end);
};
