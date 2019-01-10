var WebSocketServer = require("websocket").server;
var http = require("http");
var readline = require("readline");
const uuidv4 = require('uuid/v4'); //produces random number

var server = http.createServer(function(request, response) {
  console.log(new Date() + " Received request");
});
server.listen(9000, function() {
  console.log(new Date() + " listening on port 9000");
});

wsServer = new WebSocketServer({
  httpServer: server
});

var connections = {}; //Factory pattern for each new connection
var players = {}; // To store all current users
var games = {}; //To store all current games
var timerMain; //Used as main timer for server
var gameWords = ["Apple", "Apricot", "Avacado", "Banana", "Bilberry", "Blackcurrant", "BlueBerry", "Boysenberry", "Currant", "Coconut", "Lychee", "Mango", "Mulberry", "Olive", "Orange", "Lime", "Kiwi", "Juniper", "Pear", "Persimmon", "Physalis", "Pineapple", "Plum", "Strawberry", "Star fruit", "Redcurrant", "Quince" ];
var wordTimer = 0;
var gameLengthTimer = 30;

wsServer.on("request", function(request) {
  var connection = request.accept(null, request.origin);
    var id = uuidv4(); //assigns random number as the ID


  connection.on("close", function(reasonCode, description) {
    console.log("Closing a connection");
	removePlayer(id); //removes the player from Players
    delete connections[id];   // Delete the connection from the object once the client disconnects.
  });
  


  // Add the new connection to the array of connections.
  connections[id] = connection;
  for (var id in connections) {
    //connections[id].sendUTF("A new connection was made - now " + Object.keys(connections).length + " connected clients (" + connection.id + ")");
  }

    connection.on("message", function incoming(request) {		
        console.log(request.utf8Data);

		if (identifyMsg(request) == "player"){ //Confirming it's a new player joining	
			console.log("New Player!");		
			createPlayer(request, id);
			
			console.log(Object.keys(connections).length + "Total Connections");
			console.log(Object.keys(players).length + "Total Players");
		} else if (identifyMsg(request) == "score"){
			console.log("SCOREEEEEEEEEEEEEEEEEEEE");
			
			for (var p in games){
				//console.log(games[p].p1.Id);//Player id
			if (id == games[p].p1.Id){ // use the connection ID to find the player within a game
				console.log("YUPPPP");
				games[p].p1Score = getScore(request); //update the player score
			}
			else if (id == games[p].p2.Id){ // use the connection ID to find the player within a game
				console.log("YUPP");
				//getScore(request);
				games[p].p2Score = getScore(request);  //update the player score
			}
					
					//connections[id].sendUTF("AHHHHHHHHHHHHH");				
					//connections[games[p].p2.Id].sendUTF("AGGGGGGGGGGGGG"); THESE BOTH GO TO THE SAME ID
					//console.log(id) + "Just ID";
					//console.log(games[p].p2.Id + "BIG LONG ONE");
			
		
			}
		}
		
    });

});

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//function askQuestion() {
 // rl.question("Enter a message ('quit' to end)", function(answer) {
 //   if (answer === 'quit') {
 //     return rl.close();
 //   }
//
//    for (var id in connections) {
//      connections[id].sendUTF("New message (obj): '" + answer + "'");
//    }

//    askQuestion(); //Never ending loop
 // });  
//}
function removePlayer(id){//Removes a player from Players if they disconnect
	for (var ident in players){
		if (players[ident].Id == id){
			delete players[ident];
		}
	}
}

function identifyMsg(message){//Used to identify the type of message sent from client
	var fullMsg = message.utf8Data;
	if (fullMsg.includes("~")){//Used to identfy is the message is a new user settings being recieved
		return "player";
	} else if (fullMsg.includes("score")){
		return "score";
	}
}

function getScore(message){//Returns the user score, removing the word "score"
	var fullMsg = message.utf8Data;
	var score = 0;
	score = fullMsg.slice(5);
	return score;
}
function startTicker(){
	console.log("Ticker ON");
	timerMain = setInterval(main, 1000); //Calls the main function once a second.
}
function stopTicker(){
	clearTimeout(timerMain);
}


function createPlayer(message, id){ //Creates new user object, using the users color and name and connection id
console.log("Creating player")
var color = getColor(message);
var name = getUserName(message);
    players[id] = playerFactory.create(color, name, id); //Creates new playerr object
    console.log(players[id].name + "Created");
}


function createGameObj(player1, player2){ //Creates a new Game object 
	var GId = uuidv4(); //Produces random ID
	games[GId] = gameFactory.create(player1, player2); //Creates new gameID
	
}

function assignPlayers(){ //Returns two players in a single array which are not in a game.
	var counter = 0;
	var P1;
	var P2;
	
	if ( Object.keys(players).length >= 2){
	for (var id in players){ //For each object within players
		if (players[id].playing == "N" && counter < 2){ //If the player is not already in a game
			if (counter == 0){
			P1 = players[id].Id;
			console.log(players[id].playing + "  Player 1");
			console.log("Changed to"+ " Player 1");
			players[id].playing = "Y";
			console.log(players[id].playing + " Player 1");
			counter++;
			}
			else if (counter == 1){
				P2 = players[id].Id;
				counter++;
			console.log(players[id].playing + " Player 2");
			console.log("Changed to" + " Player 2");
			players[id].playing = "Y";
			console.log(players[id].playing + " Player 2"); //------------------------------ Finished here tonight, now to start the timer for the game(s) and start sending over the data to the client! Also need to stop this ticker from running when it's not needed 
				var comboPlayers = [P1, P2];
				return comboPlayers;
			}
		}
		}
}
return false;
}

function createGame(){
var comboPlayers = assignPlayers(); //Assign two players who are not in a game.
	if (comboPlayers != false){
		createGameObj(players[comboPlayers[0]], players[comboPlayers[1]]); //Create new Game with these players

	}
	else{
		console.log("Cannot create a new game, no players available");
	}
}

function getColor(message){ //Returns the user chosen colour
	var x = [];
	x = message.utf8Data;
	var color = "";
	for (var i = 3; i < x.length; i++){
		if (x[i] == "~"){
			break;
	}
		color = color + x[i];
	}
	return color;
}
function getUserName(message){ //Returns the userName given by the user
		var x = [];
	x = message.utf8Data;
	var userName = "";
	var lineFound = false;
	for (var i = 0; i < x.length; i++){
		if (x[i] == "~"){
			lineFound = true;
			
	}
	if (lineFound == true && x[i] != "~"){
		userName = userName + x[i];
	}
	}
	return userName;
}

playerFactory = { //Pratical 3 | Used to create new players
	create: function (pColor, pName, pId){
		var p;
		p = {
		'color': pColor,
		'name': pName,
		'Id': pId,
		'playing':"N"
		}
	return p;
	}
};

gameFactory = { //Used to create new game objects, using player objects
	create : function (pPlayer1, pPlayer2){
		var p;
		p = {
			'p1': pPlayer1,
			'p2': pPlayer2,
			'p1Score': 0,
			'p1Score': 0,
			'gmeTime': 0
		}
		return p;
	}
};

function beginGame(){
	
incrementGTime(); //Increment Game time
	checkGTime(); //Check game time
for (var p in games){
	if (games[p].gmeTime <= 1){
		sendStart();
	} else {
	sendWord(); //Send a new word to each user
	sendGScoreName(p);
	}
}
}

function sendGScoreName(id){ //Keeps the clients uptodate with game scores
	var p1Name = games[id].p1.name;
	var p2Name = games[id].p2.name;
	
	var p1Scre = games[id].p1Score;
	var p2Scre = games[id].p2Score;
	
	var p1ID = games[id].p1.Id;
	var p2ID = games[id].p2.Id;
	
	//var message = "score" + "P1.N" + p1Name + "P1.N" + p1Scre + "P2.N" + p2Name + "P2.N" + p2Scre;
	
		connections[p1ID].sendUTF("~P1N" + p1Name);//Sends the word to player 1
		connections[p1ID].sendUTF("~P1S" + p1Scre);//Sends the word to player 1
		connections[p1ID].sendUTF("~P2N" + p2Name);//Sends the word to player 1
		connections[p1ID].sendUTF("~P2S" + p2Scre);//Sends the word to player 1
		
		connections[p2ID].sendUTF("~P1N" + p1Name);//Sends the word to player 1
		connections[p2ID].sendUTF("~P1S" + p1Scre);//Sends the word to player 1
		connections[p2ID].sendUTF("~P2N" + p2Name);//Sends the word to player 1
		connections[p2ID].sendUTF("~P2S" + p2Scre);//Sends the word to player 1

		//Send one message for each thing
}


function checkGTime(){ //Check time, end game if time >= 60 seconds
	  for (var id in games) {
    if (games[id].gmeTime >= gameLengthTimer){
		winner = findWinner(id);
		console.log(winner);
		sendScoreWinner(winner, id);
		//updatePlayerGState(id);
		removeGame(id);
		//stopTicker();
		//END GAME
		//Send message to client to end the game
		//Display the scoreboard
	}
   }
}

function updatePlayerGState(id){//Changes player "playing" state to "N" since the game is finished
	games[id].p1.playing = "N";
	games[id].p2.playing = "N";
}

function sendScoreWinner(winner, id){//Sends the winning score the players at the end of each game
	var p1ID = games[id].p1.Id;
	var p2ID = games[id].p2.Id;
	
	var p1Sc = games[id].p1Score;
	var p2Sc = games[id].p2Score;
	
	var message;
	if (winner == "draw"){
		message = "Draw." + p1Sc ;
		connections[p1ID].sendUTF(message);//Sends the word to player 1
		connections[p2ID].sendUTF(message);//Sends the word to player 1
		
	} else if (winner == "p1Score"){
		message = "Player1Win." + p1Sc + "Player2Loose." + p2Sc;
		connections[p1ID].sendUTF(message);//Sends the word to player 1
		connections[p2ID].sendUTF(message);//Sends the word to player 2
	} else if (winner == "p2Score"){
		
		message = "Player2Win." + p2Sc + "Player1Loose." + p1Sc;
		connections[p1ID].sendUTF(message);//Sends the word to player 1
		connections[p2ID].sendUTF(message);//Sends the word to player 1
	}
}

function removeGame(id){ //Deletes the game after it's completed
	console.log(Object.keys(games).length + " = Amount of games before");
console.log("REMOVING GAME");
	delete games[id];
	console.log("GAME REMOVED");
	console.log(Object.keys(games).length + " = Amount of games after");
}

function findWinner(id){//Returns the winner (p1 or p2)
	var player1 = 0;
	var player2 = 0;
	player1 = games[id].p1Score;
	player2 = games[id].p2Score;
	
	if (player1 > player2){
		return "p1Score";
	}
	else if (player2 > player1){
		return "p2Score";
	}
	else {
		return "draw";
	}
}

function incrementGTime(){ //Increment the game timer by 1 each Tick
wordTimer++;
  for (var id in games) {
    games[id].gmeTime = games[id].gmeTime + 1;
   }
}

function sendWord(){ //Sends a random word to all players within all games
	var p1ID;
	var p2ID;
    for (var p in games) {
		console.log("SENDING MESSAGE GAMES");
		//send something to each player within the game
		for (var q in connections) {
			console.log("SENDING MESSAGE CONNECTIONS");
			p1ID = games[p].p1.Id; //Gets ID of player1 
			p2ID = games[p].p2.Id; //Gets ID of player2 
		}
			var word = gameWords[Math.floor((Math.random() * (gameWords.length - 1)))]; //Chooses a random word from gameWords array
			connections[p1ID].sendUTF(word);//Sends the word to player 1
			connections[p2ID].sendUTF(word);//Sends the word to player 2
    }
}
 function sendStart(){
	 var p1ID;
	var p2ID;
    for (var p in games) {
		console.log("SENDING MESSAGE GAMES");
		//send something to each player within the game
		for (var q in connections) {
			console.log("SENDING MESSAGE CONNECTIONS");
			p1ID = games[p].p1.Id; //Gets ID of player1 
			p2ID = games[p].p2.Id; //Gets ID of player2 
		}
			
			connections[p1ID].sendUTF("start");//Sends the word to player 1
			connections[p2ID].sendUTF("start");//Sends the word to player 2
    }
 }




function main(){
	console.log("Tick");
	console.log(Object.keys(players).length + "Total Players");
	if (Object.keys(players).length >= 2){
		
		console.log("Got to Main!")
		createGame();
		console.log(Object.keys(games).length + " Games Exisit")
		
		if (Object.keys(games).length >= 1){
			//run each game
			console.log("TICK GAME RUNNING");
			beginGame();
			

		}
		
	}
}

startTicker();

