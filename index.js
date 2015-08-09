#!/usr/bin/env node

var app = require('express')();
var server = require('http').Server(app);
var config = require('./config.json');
var services = {};
var portsRange = '';

for (i in config.services) {
  portsRange += i + ',';
  services[i] = {name: config.services[i], active: false};
}
portsRange = portsRange.substring(0, portsRange.length - 1);

function getPorts() {
  require('node-libnmap').nmap('scan', {
    range: [config.host],
    ports: portsRange
  }, function(err, report) {
    if (err) return;
    for (i in report[0][0].ports)
      services[report[0][0].ports[i].port].active = report[0][0].ports[i].state == 'open';
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
