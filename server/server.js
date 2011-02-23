var fs = require('fs')
var http = require('http')
var io = require('../lib/socket.io')
// var User = require('../model/user.js')

var server = http.createServer(function(request, response) {
	response.writeHead(400);
	response.write('404');
	response.end();
})

server.listen(8080);

var socket = io.listen(server);
socket.on('connection', function(client) {
	console.log(client.sessionId + ' connected.');
	client.broadcast(JSON.stringify({type: 'welcome', user: { id: client.sessionId}}));

	client.on('message', function(message) {
		var data = JSON.parse(message);
		
		switch (data.type) {
			case 'update':
				client.broadcast(JSON.stringify({type: 'update', user: { id: client.sessionId, angle: data.angle }}));
			break;
		}
	});
	
	client.on('disconnect', function(message) {
		console.log(client.sessionId + ' disconnected.');
		client.broadcast(JSON.stringify({type: 'disconnect', user: { id: client.sessionId }}));
	});
});