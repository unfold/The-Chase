var fs = require('fs')
var http = require('http')
var io = require('../lib/socket.io')

var server = http.createServer();

server.listen(8080);

var socket = io.listen(server);

socket.on('connection', function(client) {
	client.broadcast({type: 'connect', userId: client.sessionId });
	
	client.on('message', function(data) {
		data.userId = client.sessionId;
		client.broadcast(data);
	});
	
	client.on('disconnect', function(message) {
		client.broadcast({type: 'disconnect', userId: client.sessionId });
	});
});