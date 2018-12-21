//Import the module.
var WebSocketClient = require("websocket").client;

//Instantiate a client
var client = new WebSocketClient();



client.on("connect", function(connection){
//set up an event handler to process messages received from the server


connection.on("message", function(message){
	var d = new Date();
	var n = d.toLocaleTimeString();
	
console.log("Received: " + message.utf8Data + " " + n + "\n");
});

//When the connection is established, send the server a message
connection.sendUTF("Handshake from Client");
});
client.connect("ws://localhost:9000");