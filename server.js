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
var testCounter = 0;

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
    connections[id].sendUTF("A new connection was made - now " + Object.keys(connections).length + " connected clients (" + connection.id + ")");
  }

    connection.on("message", function incoming(request) {		
        console.log(request.utf8Data);

		if (identifyMsg(request) == "player"){ //Confirming it's a new player joining	
			console.log("New Player!");		
			createPlayer(request, id);
			
			console.log(Object.keys(connections).length + "Total Connections");
			console.log(Object.keys(players).length + "Total Players");

		};
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
	}
}
function startTicker(){
	console.log("Ticker ON");
	timerMain = setInterval(main, 1000); //Calls the main function once a second.
}
function stopTicker(){
	clearTimeout(timerMain);
}


function createPlayer(message, id){ //Creates new user object, using the users color and name
console.log("Creating player")
var color = getColor(message);
var name = getUserName(message);
    players[id] = playerFactory.create(color, name, id); //Creates new playerr object
    console.log(players[id].name + "Created");
}


function createGame(player1, player2){ //Creates a new Game object 
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

function beginGame(){
var comboPlayers = assignPlayers(); //Assign two players who are not in a game.
	if (comboPlayers != false){
		createGame(players[comboPlayers[0]], players[comboPlayers[1]]); //Create new Game with these players

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





function main(){
	console.log("Tick");
	console.log(Object.keys(players).length + "Total Players");
	if (Object.keys(players).length >= 2){
		
		console.log("Got to Main!")
		beginGame();
		
		if (Object.keys(games).length >= 1){
			//run each game
			console.log("TICK GAME RUNNING");
			
				testCounter = testCounter + 1;
				if (testCounter >= 2){
					stopTicker();
				}
		}
		
	}
}

startTicker();

