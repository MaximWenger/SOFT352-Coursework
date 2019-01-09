// Your JavaScript functions go here

var WebSocketClient = new WebSocket("ws://localhost:9000");
var words = [];

WebSocketClient.onopen = function(event){ //When connection is on, do this
	WebSocketClient.send("Hello world from the client");
//	var connected = false;
	console.log("Socket connected succes");
	updateConnStatus();
}

WebSocketClient.onmessage = function(message){ //When get a message, do this
    console.log("Received: " + message.data);
var msg = identifyMsg(message);
if (msg == "start"){
	//Remove everything and be ready to recieve and display words!
	$(".mainStart").css("visibility", "hidden"); //Once the game starts, remove the original webpage
} else if (msg == "play"){
	words[words.length] = message.data;//Store the words within an array
	//NOW move these words onto any of the grids
	//Display the words within the grids 
//Have the letters change, depending on what is being typed
//The word will automatically be entered, no pressing enter
//The timer will appear in the top left, along with the enemy, and each score (Score 1pt per letter of a correct word)
}
}

WebSocketClient.onerror = function (event){
	console.log("Error connecting to server =" + event);
	
}

function identifyMsg(message){//Used to identify the type of message sent from server
	var fullMsg = message.data;
	console.log(fullMsg);
	if (fullMsg.includes("start")){//Used to identfy if the message is a new game
		return "start";
	}
	else {
		//words[words.length] = fullMsg; 
		return "play";
	}
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

	WebSocketClient.send(color + "~" + userName);
});


});
