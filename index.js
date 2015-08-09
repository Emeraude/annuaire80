#!/usr/bin/env node

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var config = require('./config.json');
var servicesState = new (require('events')).EventEmitter();
var services = {};
var portsRange = '';

for (i in config.services) {
  portsRange += i + ',';
  services[i] = {name: config.services[i], active: false, port: i};
}
portsRange = portsRange.substring(0, portsRange.length - 1);

function getPorts() {
  require('node-libnmap').nmap('scan', {
    range: [config.host],
    ports: portsRange
  }, function(err, report) {
    if (err) return;
    var updatedServices = [];
    for (i in report[0][0].ports) {
      var service = services[report[0][0].ports[i].port];
      if (service.active != (report[0][0].ports[i].state == 'open')) {
	updatedServices.push(service);
	service.active = report[0][0].ports[i].state == 'open';
      }
    }
    if (updatedServices.length)
	servicesState.emit('update', updatedServices);
  });
  setTimeout(getPorts, config.time * 1000);
}

getPorts();

server.listen(config.port);
app.engine('jade', require('jade').__express)
  .use(require('compression')())
  .use(require('serve-static')('public/'))
  .get('*', function(req, res) {
    res.render('home.jade', {title: config.title,
			     services: services,
			     location: config.protocol + '://' + config.host});
  });

io.on('connection', function(socket) {
  servicesState.removeAllListeners('update');
  servicesState.on('update', function(services) {
    var datas = {
      host: config.host,
      protocol: config.protocol,
      services: services
    };
    socket.broadcast.emit('update', datas);
    socket.emit('update', datas);
  });
});
