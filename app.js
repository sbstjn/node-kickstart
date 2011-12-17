var express = require("express");
var connect = require("connect");

var conf = {
  'name': 'example.com',
  'port': process.env.PORT || 8585,
  'sessionSecret': 'lorem123'
};

/* Compress generated less files  */
var less;
express.compiler.compilers.less.compile = function (str, fn) {
  if (!less) less = require("less");                                                      
  try {
      less.render(str, { compress : true }, fn);
  } catch (err) {
      fn(err);
  }
};


var srv = express.createServer(
  /* Optional: Use SSL certificate */
  /* {   ca:     fs.readFileSync('/var/node/rapdb/cert/general/sub.class1.server.ca.pem').toString(),
    , key:    fs.readFileSync('/var/node/rapdb/cert/static/static.key').toString(), 
    , cert:   fs.readFileSync('/var/node/rapdb/cert/static/static.crt').toString()},  */
  /* Optional: Use global db connection handler */
  /* function(req, res, next) { if (req.db === undefined) { req.db = db; } next(); } */);

srv.set('views', __dirname+'/views'); 
srv.set('view engine', 'jade');
srv.set('view cache', false);   

srv.configure(function() {     
  srv.use(express.cookieParser());
  srv.use(express.session({ secret: conf.sessionSecret }));
  srv.use(express.logger(':method :url - :referrer'));
  srv.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  srv.use(express.compiler({ src:__dirname + '/public', enable: ['less'] }));
  srv.use(express.static(__dirname + '/public'));
  srv.use(express.bodyParser());
});

srv.configure('development', function(){
  srv.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

srv.configure('production', function(){
  srv.use(express.errorHandler());
});

srv.all('*', function(req, res) {
  res.render('home', {title: 'node-kickstart'});
});

var router = express.createServer(connect.vhost(conf.name, srv));
router.use(express.cookieParser());
router.use(express.session({ secret: conf.sessionSecret }));
router.listen(conf.port);

console.log("Express server listening on http://%s:%d in %s mode", conf.name, router.address().port, router.settings.env);
