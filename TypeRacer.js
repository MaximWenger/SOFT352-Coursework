// Your JavaScript functions go here

var WebSocketClient = new WebSocket("ws://localhost:9000");

WebSocketClient.onopen = function(event){ //When connection is on, do this
	WebSocketClient.send("Hello world from the client");
//	var connected = false;
	console.log("Socket connected succes");
	updateConnStatus();
}

WebSocketClient.onmessage = function(message){ //When get a message, do this
    console.log("Received: " + message.data);
}

WebSocketClient.onerror = function (event){
	console.log("Error connecting to server =" + event);
	
}



function updateConnStatus(){ //Updates server status to green
	$(".serverStatusBx").css("background-color", "#008000");
	$('#serverStatusTxt').text('Online');
}
function chosenColor(Color){ //Turns all other colors opaque (Keeping chosen color full)
	var colors = [".dot1", ".dot2", ".dot3", ".dot4"];
	var color = Color;
	for (var i = 0; i <= colors.length; i++){
		if (colors[i] != color){
		$(colors[i]).css("opacity", "0.2");
		}
		else {
			$(colors[i]).css("opacity", "1");
		}
	}
}

function sendServer(message){
	WebSocketClient.send(message);
}

$(document).ready(function(){

$(".dot1").click(function () {
console.log("Chosen .dot1");
chosenColor(".dot1");
});
$(".dot2").click(function () {
console.log("Chosen .dot2");
chosenColor(".dot2");
});
$(".dot3").click(function () {
console.log("Chosen .dot3");
chosenColor(".dot3");
});
$(".dot4").click(function () {
console.log("Chosen .dot4");
chosenColor(".dot4");
});

$("#userStartBtn").click(function(){
	//sendServer("testing testing, 1,2,3");
	WebSocketClient.send("HELOOOOOOO");
});


});
