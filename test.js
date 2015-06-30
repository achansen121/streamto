
var request = require('request');
var jsdom = require('jsdom');
var streamall = require('./index.js');
var EventEmitter = require('events').EventEmitter;
var headers = require("./chromeheaders.js");
var url = require('url');


var lgetter = function(u_in){
  var as  = new streamall();
  var gtl = new EventEmitter();
  gtl.on("error",function(err){
    if(gtl.listeners("error").length==1)
      throw err;
  });

  request.get(u_in , {headers:headers})
  .on("response",function(res){
    res.pipe(as);
  });
  as.on("data",function(data){
    jsdom.env({html:data.toString(),done:function(err,window){
      if(err)
        gtl.emit("error",err);
      else
        gtl.emit("links",window.document.querySelectorAll('a'));
    }});
  });
  as.on('error',function(err){
    gtl.emit("error",err);
  });
  gtl.on("links",function(lnks){
    lnks = Array.prototype.slice.call(lnks)
    .map(function(lnk){ return lnk.getAttribute("href"); })
    .filter(function(lnk){ return !!lnk; })
    .forEach(function(lnk){
      gtl.emit("link",lnk);
    });
    gtl.emit("end");
  });
  return gtl;
};
var print = function(data){
  console.log(data+"");
};
print.resolve = function(rurl){
  return function(data){
    var nu = url.resolve(rurl,data+"");
    print(nu);
  };
};

var run = function(){
  var u_azn = "http://www.amazon.com";
  lgetter(u_azn)
  .on("link",print.resolve(u_azn));
};

if(require.main==module)
  run();

