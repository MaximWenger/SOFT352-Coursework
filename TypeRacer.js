// Your JavaScript functions go here

var WebSocketClient = new WebSocket("ws://localhost:9000");
var wordsLive = [];
var wordsReserve = [];
var gameStart = false;

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
	gameStart = true;
	changeGameModePlay();
	
} else if (msg == "play"){//Store the words within an array
	if (wordsLive.length <= 11){
	wordsLive[wordsLive.length] = message.data;//Only keep 12 words ready at any time
	}
	else {
		wordsReserve[wordsReserve.length] = message.data;//Used to store all other words
	}
	populateWords();
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

function changeGameModePlay(){ //Change the visibility to remove front page and display game page.
	$(".mainStart").css("visibility", "hidden"); //Once the game starts, remove the original webpage
	$(".mainGame").css("visibility", "visible");//Show the game page
	$("#userGameTxt").select(); //Autoselect the textbox so the user can begin typing
}

function populateWords(){//Populates the words for the user to type

if (wordsLive.length < 12 && wordsReserve.length > 1){
	wordsLive[wordsLive.length] = wordsReserve[0];
	wordsReserve.splice(1, 1);//Removes the word from wordsReserve
}
	
	for (var i = 0; i <= 12 && i < wordsLive.length; i++){ //Populate the display grid with given words from the server
		$("#grid" + (i + 1)).text(wordsLive[i]);
	}
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
	$(".mainGame").css("visibility", "hidden"); //Hide the game page
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

$("body").keypress(function(evt){//
var userValue = $('#userGameTxt').val();
var matches = false;
var lengthMatch = 0;
if (gameStart == true){//the game has started

for (var q = 0; q <= wordsLive.length; q++){ //Determines if the user has correctly typed the whole word displayed on the screen
	var word = wordsLive[q]
	for (var i = 0; i <= userValue.length; i++){//For the entire length of the user value
	if ((tryMatch(userValue.slice(0,1), word.slice(0,1))) == true){
		console.log("MATCHING");
		
		matches = tryMatch(userValue, word); //Tries to see if the whole word matches
		if (matches == true){
			console.log("WHOLE WORD IS MATCHING")
			removeLiveWord(q);
			console.log("WORD IS NOW GONE");
			clearUserInput();
			//REMOVE THIS WORD, SEND SCORE AND UPDATE THE FRONT
			
		} else {
			for (var x = 0; x <= userValue.length; x++){
				if (tryMatch(userValue.slice(0,x), word.slice(0,x)) == true){
					//UPDATE THE COLOURS ON THE CORRECT DISPLAYED WORD
					console.log("LOOKS TO BE GOOD ");
				}
			}
		}
	}
	}
}
}
});


});

function removeLiveWord(number){//Removes the live word after user has typed it correctly
	wordsLive.splice(number, 1);//Removes the word from wordsReserve
	
}

function clearUserInput(){//Clears the user input, to allow them to continue typing
	$('#userGameTxt').val(""); 
}

function tryMatch(user, wordStore){//used to compare the user imput to stored words
	if (user == wordStore){
		return true;
		//It matches! Try another one
		}
		else {
			return false;
		}
}
