//Import the requred modules.
var WebSocketServer = require("websocket").server;
var http = require("http");
var readline = require("readline");

//Instantitate a socket object.
var server = http.createServer(function(request, response){
console.log(new Date() + " Recieved request");
});

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

server.listen(9000, function(){
console.log(new Date() + " listening on port 9000");


});
var socket = new WebSocketServer({httpServer: server});




socket.on("request", function(request){
	var connection = request.accept(null, request.origin);
	
	connection.on("close", function(reasonCode, description){
		console.log("Connection closed");
	});
	

	connection.on("message", function(message){
		console.log(message.utf8Data);
	console.log("Handshake from server \n");
	
		//connection.sendUTF(message.utf8Data);
		
	
});

	rl.question("Enter message for client \n", function(answer){ //While BOOL x is false, constantly call this function. If ESC is pressed, BOOL == true;
		connection.sendUTF(answer);
	console.log("Sent message: ", answer, " :to client");
	
});
	

});
