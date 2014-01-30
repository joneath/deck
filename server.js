var connect = require('connect');
var port = process.env.PORT || 3000;

var app = connect()
  .use(connect.logger('dev'))
  .use(connect.static('app'))
  .listen(port);
