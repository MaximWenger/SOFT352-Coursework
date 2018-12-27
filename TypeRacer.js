// Your JavaScript functions go here

var WebSocketClient = new WebSocket("ws://localhost:9000");

WebSocketClient.onmessage = function(message){ //When get a message, do this
    console.log("Received: " + message.data);
    alert(message.data);
}

WebSocketClient.onerror = function (event){
	console.log("Error connecting to server =" + event);
	
}

function connectToServer(){
//var client = new WebSocketClient();
var connected = false;
WebSocketClient.onopen = function(event){ //When connection is on, do this
	WebSocketClient.send("Hello world from the client");
	alert('Socket connected succes');
	connected = true;

}
return connected;
}




$(document).ready(function(){
	connectToServer();

	
$(".dot1").click(function () {
alert('Click is working!');
});
$(".dot2").click(function () {
alert('Click is working!');
});
$(".dot3").click(function () {
alert('Click is working!');
});
$(".dot4").click(function () {
alert('Click is working!');
});

});
