// Your JavaScript functions go here

var WebSocketClient = new WebSocket("ws://localhost:9000");

//var client = new WebSocketClient();

WebSocketClient.onopen = function(event){ //When connection is on, do this
	WebSocketClient.send("Hello world from the client");
	alert('Socket connected succes');
};

WebSocketClient.onmessage = function(message){ //When get a message, do this
    console.log("Received: " + message.data);
    alert(message.data);
}

$(document).ready(function(){

});
