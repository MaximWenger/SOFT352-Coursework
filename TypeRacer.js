// Your JavaScript functions go here

var WebSocketClient = new WebSocket("ws://localhost:9000");
var wordsLive = [];
var wordsReserve = [];
var gameStart = false;
var opponentName;
var opponentScore;
var userName;
var score;
var p1Name;
var p2Name;
var p1Score = 0;
var p2Score = 0;


WebSocketClient.onopen = function(event){ //When connection is on, do this
	WebSocketClient.send("Hello world from the client");
	console.log("Socket connected succes");
	updateConnStatus();
}

WebSocketClient.onmessage = function(message){ //When get a message, do this
    console.log("Received: " + message.data);
var msg = identifyMsg(message);
if (msg == "start"){
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
}
}

WebSocketClient.onerror = function (event){
	console.log("Error connecting to server =" + event);
}

function identifyMsg(message){//Used to identify the type of message sent from server
	var fullMsg = message.data;
	//console.log(fullMsg);
	if (fullMsg.includes("start")){//Used to identfy if the message is a new game
		return "start";
	}
	else if (fullMsg.includes("Draw")){ //Used to identify if the game is over and drawn
	populateLocalScore();
		return "draw";
	}
	else if (fullMsg.includes("Win")){ //Used to identify if the game is over and won
	populateLocalScore(fullMsg);
		return "win";
	}
	else if (fullMsg.includes("~P")){
		updateScores(fullMsg);
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


function updateScores(message){ //Gets values of player usernames and player scores
	var fullMsg = message;
	if (fullMsg.includes("~P1N")){//Player 1 name
	 p1Name = getScoreValues(message);
	 console.log(p1Name + "P1 NAME");
	}
	else if (fullMsg.includes("~P1S")){ //Player 1 score
		p1Score = getScoreValues(message);
		 console.log(p1Score + "P1 SCORE");
	}
	else if (fullMsg.includes("~P2N")){ //Player 2 name
		p2Name = getScoreValues(message);
		 console.log(p2Name + "P2 NAME");
	}
	else if (fullMsg.includes("~P2S")){
		p2Score = getScoreValues(message); //Player 2 score
		console.log(p2Score + "P2 SCORE");
	}
	updateFrontScores();
}

function updateFrontScores(){//Updates scores on front page
	if (userName == p1Name){//Find who this player is (p1 or p2?)
		$("#userInfo").text("Your Score:" + p1Score);
	$("#opponentInfo").text(p2Name + "'s Score:" + p2Score);
	} else if (userName == p2Name){
		$("#userInfo").text("Your Score:" + p2Score);
		$("#opponentInfo").text(p1Name + "'s Score:" + p1Score);
	}
}

function getScoreValues(message){//Returns the score or userName for the current players
var fullMsg = message;
var scoreValue;
scoreValue = fullMsg.slice(4);
return scoreValue;
}

function populateLocalScore(message){ //populate the scoreboard with local scores
if (localStorage.win1 == null){ //If no score is kept, populate with default values
localStorage.win0 = 0; //Used to keep the score of winners
localStorage.win1 = 0;

localStorage.name0 = ""; //User to keep the name of winners
localStorage.name1 = "";
}
 var winScore;
 var winPlayer;
 var position;
 if (p1Score > p2Score){ //Used to determine if the new score is higher the scores already stored locally!
	winScore = p1Score;
	winPlayer = p1Name;
	position = sortLeaderBoard(winScore, winPlayer);
	} else if (p2Score > p1Score){
		winScore = p2Score;
		winPlayer = p2Name;
		position =  sortLeaderBoard(winScore, winPlayer);
	}
	displayLocalBoard();
}

function sortLeaderBoard(score, winplayer){ //Updates the local leader board
	if (localStorage.win0 < score){
		localStorage.win0 = score;
		localStorage.name0 = winplayer;
	}
	else if (localStorage.win1 < score){
		localStorage.win1 = score;
		ocalStorage.name1 = winplayer;
	}
}

function displayLocalBoard(){ //Display the local scoreboard!
$(".displayScoreBoard").css("visibility", "visible");
if (localStorage.win0 > 1){
	$('#scoreDisplay1').text("1: " + localStorage.name0 + " scored " + localStorage.win0 + " points!");
}
if (localStorage.win1 > 1){
	$('#scoreDisplay1').text("2: " + localStorage.name1 + " scored " + localStorage.win1 + " points!");
}
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

function sendServer(message){//Sends a message to the server
	WebSocketClient.send(message);
}

function removeLiveWord(number){//Removes the live word after user has typed it correctly
	wordsLive.splice(number, 1);//Removes the word from wordsReserve
}

function clearUserInput(){//Clears the user input, to allow them to continue typing
	$('#userGameTxt').val(""); 
}

function tryMatch(user, wordStore){//used to compare the user imput to stored words
	if (user == wordStore){
		return true; //The word does match
		}
		else {
			return false;//The word does not match
		}
}

function sendScore(score){ //Sends the score of the correct word to the server
	sendServer("score" + score);
	console.log("SCORE SENT");
}

function testUserText(){//Used to find out if the users Text matches with any of the given words
var userValue = $('#userGameTxt').val();
var matches = false;
var lengthMatch = 0;
var word;
var complete = false;  //Used to ensure only one word is removed if dupes within the array
if (gameStart == true){//the game has started
while (complete == false){
for (var q = 0; q <= wordsLive.length; q++){ //Determines if the user has correctly typed the whole word displayed on the screen
	word = wordsLive[q]
	for (var i = 0; i <= userValue.length; i++){//For the entire length of the user value
	if ((tryMatch(userValue.slice(0,1), word.slice(0,1))) == true){
		console.log("MATCHING");
		
		matches = tryMatch(userValue, word); //Tries to see if the whole word matches
		if (matches == true){
			console.log("WHOLE WORD IS MATCHING")
			removeLiveWord(q);
			
			console.log("WORD IS NOW GONE");
			complete == true; //Used to ensure only one word is removed if dupes within the array
			sendScore(word.length);
			clearUserInput();
			break;
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
}
}

$(document).ready(function(){
	$(".mainGame").css("visibility", "hidden"); //Hide the game page

	$(".displayScoreBoard").css("visibility", "hidden");
	
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
	 userName = $('#userName').val();
	WebSocketClient.send(color + "~" + userName);
});

$("body").keypress(function(evt){
testUserText();//Used to find out if the users Text matches with any of the given words
});
});


