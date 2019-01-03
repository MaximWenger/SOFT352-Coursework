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
function chosenColor(Color){ //Turns all other colors opaque (Keeping chosen color full) Returns chosen color
	var colors = ["dotPink", "dotOrange", "dotBlue", "dotGreen"];
	var color = Color;
	for (var i = 0; i <= colors.length; i++){
		if (colors[i] != color){
		$("." + colors[i]).css("opacity", "0.2");
		}
		else {
			$("." + colors[i]).css("opacity", "1");
		}
	}
	return color;
}

function sendServer(message){
	WebSocketClient.send(message);
}

$(document).ready(function(){
	var color = "unspecified"; //Used to store the users chosen color

$(".dotPink").click(function () {
console.log("Chosen dotPink");
color = chosenColor("dotPink");//Used to update the users chosen color

});
$(".dotOrange").click(function () {
console.log("Chosen dotOrange");
color = chosenColor("dotOrange");

});
$(".dotBlue").click(function () {
console.log("Chosen dotBlue");
color = chosenColor("dotBlue");

});
$(".dotGreen").click(function () {
console.log("Chosen dotGreen");
color = chosenColor("dotGreen");

});

$("#userStartBtn").click(function(){
	//sendServer("testing testing, 1,2,3");
	var userName = $('#userName').val();

	WebSocketClient.send("C." + color + ".UN" + userName);
});


});
