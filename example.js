var kickstart = require('./index.js').withConfig({'name': 'rapdb.de', 'port': 8585, 'path': __dirname});
var srv = kickstart.srv();

srv.all('*', function(req, res) {
  res.render('home', {title: 'node-kickstart'});
});

var router = kickstart.listen();
console.log("Listening on http://%s:%d", kickstart.conf().name, router.address().port);