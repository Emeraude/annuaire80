#!/usr/bin/env node

var app = require('express')();
var server = require('http').Server(app);
var config = require('./config.json');
var url = require('url');
var services;
var portsRange = '';

for (i in config.services) {
    portsRange += i + ',';
}
portsRange = portsRange.substring(0, portsRange.length - 1);

function getPorts() {
    require('node-libnmap').nmap('scan', {
	range: ['127.0.0.1'],
	ports: portsRange
    }, function(err, report) {
	if (err) throw err;
	services = [];
	for (i in config.services) {
	    service = {
		port: i,
		name: config.services[i],
		active: false
	    };
	    for (j in report[0][0].ports)
		if (report[0][0].ports[j].port == service.port)
		    service.active = true;
	    services.push(service);
	}
    });
    setTimeout(getPorts, config.time * 1000);
}

getPorts();

server.listen(config.port);
app.engine('jade', require('jade').__express)
    .use(require('compression')())
    .use(require('serve-static')('public/'))
    .get('*', function(req, res) {
	parsedUrl = url.parse('http://' + req.headers.host);
	res.render('home.jade', {title: config.title,
				 services: services,
				 location: parsedUrl.protocol + '//' + parsedUrl.hostname});
    });
