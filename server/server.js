var fs = require('fs')
var http = require('http')
var io = require('../lib/socket.io')

var server = http.createServer();

server.listen(8080);

var socket = io.listen(server);
var viewers = [];

socket.on('connection', function(client) {
	var sendDataToViewers = function(data) {
		for(i in viewers) {
			viewers[i].send(data);
		}
	}
	
	client.on('message', function(data) {
		if(data == 'viewer') {
			viewers.push(client);
		} else {
			data.userid = client.sessionId;
			sendDataToViewers(data);
		}
	});
	
	client.on('disconnect', function(message) {
		sendDataToViewers({type: 'disconnect', userid: client.sessionId });
	});
});